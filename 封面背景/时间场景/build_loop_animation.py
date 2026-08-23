from pathlib import Path
from PIL import Image


ROOT = Path(__file__).resolve().parent
SOURCES = [
    ROOT / "01-早上.png",
    ROOT / "02-上午.png",
    ROOT / "03-下午.png",
    ROOT / "04-傍晚.png",
    ROOT / "05-晚上.png",
]


def cover_resize(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    target_ratio = size[0] / size[1]
    source_ratio = image.width / image.height
    if source_ratio > target_ratio:
        width = round(image.height * target_ratio)
        left = (image.width - width) // 2
        image = image.crop((left, 0, left + width, image.height))
    elif source_ratio < target_ratio:
        height = round(image.width / target_ratio)
        top = (image.height - height) // 2
        image = image.crop((0, top, image.width, top + height))
    return image.resize(size, Image.Resampling.LANCZOS)


def smoothstep(value: float) -> float:
    return value * value * (3.0 - 2.0 * value)


def frames(size: tuple[int, int], fps: int, seconds_per_scene: int):
    images = [cover_resize(Image.open(path).convert("RGB"), size) for path in SOURCES]
    count = fps * seconds_per_scene
    output = []
    for index, first in enumerate(images):
        second = images[(index + 1) % len(images)]
        for frame_index in range(count):
            # Exclude alpha=1 so the next transition owns the exact keyframe.
            alpha = smoothstep(frame_index / count)
            output.append(Image.blend(first, second, alpha))
    return output


def main() -> None:
    webp_frames = frames((1280, 720), fps=10, seconds_per_scene=5)
    webp_frames[0].save(
        ROOT / "时间循环动画.webp",
        save_all=True,
        append_images=webp_frames[1:],
        duration=100,
        loop=0,
        quality=84,
        method=4,
    )

    gif_frames = frames((640, 360), fps=8, seconds_per_scene=5)
    gif_frames[0].save(
        ROOT / "时间循环动画-预览.gif",
        save_all=True,
        append_images=gif_frames[1:],
        duration=125,
        loop=0,
        optimize=False,
        disposal=2,
    )


if __name__ == "__main__":
    main()
