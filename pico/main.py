import WIFI_CONFIG
from network_manager import NetworkManager
import time
import uasyncio
import urequests as requests

from picographics import PicoGraphics, DISPLAY_INKY_PACK
from pimoroni import Button


"""
Simple demo to get a random activity from BoredAPI.com
"""

last_seen_id = None

button_a = Button(12)
button_b = Button(13)
button_c = Button(14)

graphics = PicoGraphics(DISPLAY_INKY_PACK)
graphics.set_font("bitmap8")

WIDTH, HEIGHT = graphics.get_bounds()

ENDPOINT = "https://cupid.mykal.codes"
API_KEY = "QPReF8g2V7cGqFKajSzU"

def clear_screen():
    graphics.set_pen(15)
    graphics.clear()

def status_handler(mode, status, ip):
    graphics.set_update_speed(2)
    clear_screen()
    
    graphics.set_pen(0)
    status_text = "Connecting to WIFI..."
    if status is not None:
        if status:
            status_text = "WIFI Connected."
        else:
            status_text = "WIFI Could not connect."

    graphics.text(WIFI_CONFIG.SSID, 10, 10, scale=2)
    graphics.text(status_text, 10, 30, scale=2)
    graphics.update()

def req_read_arrow(id: str):
    url_arrow_read = f"{ENDPOINT}/v1/arrows/{id}"

    try:
        print(f"Requesting URL: {url_arrow_read}")
        headers = {"Authorization": f"Bearer {API_KEY}"}
        res = requests.patch(url_arrow_read, headers=headers, data={})
    except Exception as e:
        print(f"ERR: {e}")
        
        clear_screen()
        graphics.set_pen(0) # set pen as black
        graphics.text("something went wrong when marking that item as read... :(", 10, 10, wordwrap=WIDTH - 20, scale=2)
        
        graphics.update()
        


network_manager = NetworkManager(WIFI_CONFIG.COUNTRY, status_handler=status_handler)


def update():
    uasyncio.get_event_loop().run_until_complete(network_manager.client(WIFI_CONFIG.SSID, WIFI_CONFIG.PSK))
    url_arrows = f"{ENDPOINT}/v1/arrows"
    graphics.set_update_speed(1)
    
    # import global variable
    global last_seen_id
    
    # mark the last item as seen
    if last_seen_id is not None:
        print(f"DEBUG: attempting to mark {last_seen_id} as seen")
        req_read_arrow(last_seen_id)
    
    try:
        print(f"DEBUG: Requesting URL: {url_arrows}")
        headers = {"Authorization": f"Bearer {API_KEY}"}
        res = requests.get(url_arrows, headers=headers).json()
        print("DEBUG: Request worked.")
        
        clear_screen()
        graphics.set_pen(0) # set pen as black
        
        if len(res) > 0:
            last_seen_id = res[0]["id"]
            print(f"DEBUG: grabbing {res[0]["id"]}")
            
            graphics.text(res[0]["title"], 10, 10, wordwrap=WIDTH - 20, scale=2)
            graphics.line(10, 28, WIDTH-10, 28)
            graphics.set_pen(4) # set pen as gray
            graphics.text(res[0]["body"], 10, 35, wordwrap=WIDTH - 20, scale=2)
            graphics.set_pen(0) # set pen as black
            graphics.text("press 'A' to mark read", 10, 108, scale=2)
        else:
            graphics.text("no new messages <3", 10, 10, scale=3)
            graphics.text("press 'A' to refresh", 10, 108, scale=2)
            
        graphics.update()
        del headers
        del res 
        
    except Exception as e:
        print(f"ERR: {e}")
        clear_screen()
        
        graphics.set_pen(0) # set pen as black
        graphics.text("something went wrong... :(", 10, 10, wordwrap=WIDTH - 20, scale=2)
        
        graphics.update()


# Run continuously.
# Be friendly to the API you're using!
while True:
    # re-run the update script
    update()

    # wait for input to re-run this main loop
    while not button_a.is_pressed:
        time.sleep(0.1)
