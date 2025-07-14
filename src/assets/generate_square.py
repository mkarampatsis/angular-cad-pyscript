import js
import json
import math
from pyodide.ffi.wrappers import add_event_listener
from pyodide.ffi import to_js

def distance(p1, p2):
  return math.sqrt((p2["x"] - p1["x"])**2 + (p2["y"] - p1["y"])**2)

def create_square(*args, **kwargs):
  coords_js = js.JSON.parse(js.document.getElementById("input-coords").value)
  coords = [{"x": point.x, "y": point.y} for point in coords_js]
  p1, p2 = coords[0], coords[1]
  d = distance(p1, p2)

  print(f"Line length: {d}")
  print(f"Square side: {d}")
  print(f"Area: {d*d}")

  # Dispatch square data back to Angular
  detail = { "x": p1["x"], "y": p1["y"], "side": d }
  js_detail = to_js({ "detail": detail })
  print("Detail", detail)
  print("js_detail", js_detail)
  event_data = js.CustomEvent.new("squareGenerated", js_detail)
  js.document.dispatchEvent(event_data)

element = js.document.getElementById("generate-square")
add_event_listener(element, "click", create_square)
# print("test test markos 222")