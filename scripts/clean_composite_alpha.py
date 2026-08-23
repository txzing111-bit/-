from collections import deque
from PIL import Image

source = r"C:\Users\pc\Desktop\知识分享网站\src\assets\phone-ui-composite.png"
target = r"C:\Users\pc\Desktop\知识分享网站\src\assets\phone-ui-composite-clean.png"
image = Image.open(source).convert("RGBA")
width, height = image.size
pixels = image.load()
seen = bytearray(width * height)
queue = deque()

for x in range(width):
    queue.extend(((x, 0), (x, height - 1)))
for y in range(height):
    queue.extend(((0, y), (width - 1, y)))

while queue:
    x, y = queue.popleft()
    index = y * width + x
    if seen[index]:
        continue
    red, green, blue, _ = pixels[x, y]
    if min(red, green, blue) < 205 or max(red, green, blue) - min(red, green, blue) > 18:
        continue
    seen[index] = 1
    pixels[x, y] = (red, green, blue, 0)
    if x:
        queue.append((x - 1, y))
    if x + 1 < width:
        queue.append((x + 1, y))
    if y:
        queue.append((x, y - 1))
    if y + 1 < height:
        queue.append((x, y + 1))

image.save(target)
print(target)
