# from js import document, console, pyodide
# from js import document
import js
import math

def distance(p1, p2):
  print("assss")
  return math.sqrt((p2["x"] - p1["x"])**2 + (p2["y"] - p1["y"])**2)

def create_square(*args, **kwargs):
  print("create-square")
  coords_str = document.getElementById("input-coords").value
  coords = json.loads(coords_str)
  p1, p2 = coords[0], coords[1]
  d = distance(p1, p2)

  print(f"Line length: {d}")
  print(f"Square side: {d}")
  print(f"Area: {d*d}")

  # Dispatch square data back to Angular
  detail = { "x": p1["x"], "y": p1["y"], "side": d }
  event_data = CustomEvent.new("squareGenerated", { "detail": detail })
  js.document.dispatchEvent(event_data)

# proxy = pyodide.create_proxy(create_square)
js.document.getElementById("generate-square").addEventListener("click", create_square)
js.console.log("Console >>>")
print("test test markos 222")