# SmartCount — field counter

Counts welding gas cylinders on a rack, from a phone camera. **Everything runs
in the browser on the phone.** No server, no account, no network — which is the
point: gas stores are concrete buildings with no signal.

Open it: **https://aryansharma2615-lab.github.io/smartcount-field/**

Then **Share → Add to Home Screen**. After one visit it works fully offline.

## How to use it

1. **Start camera.**
2. **Calibrate** — tap the left edge of one cylinder, then its right edge. This
   is the only number the detector needs, and getting it wrong is the main cause
   of a wrong count.
3. Point at the rack. Boxes should sit on cylinders.

**The boxes are the proof.** If they are not on cylinders, the number is wrong —
recalibrate before quoting it. The page turns red when the geometry does not
look like a rack rather than handing you a confident wrong answer.

## How it works

Three layers, each useful on its own:

1. **Shape** — cylinders are tall, narrow and repeated, so a column profile of
   vertical-edge energy and body shading is matched against the repeat that the
   calibrated width implies. This is what separates cylinders standing *touching*
   each other, which colour-blob counting reports as one object.
2. **Colour** — sampled per cylinder, on the shoulder band and the body band.
3. **Tags** — a contrasting patch matching a known tag colour. Green = full,
   yellow = in use, red = empty. A tag beats where the cylinder is standing.

## What it does not do

- **It does not read pressure or level.** Full and empty come from a tag, or
  from where a cylinder sits. Nothing here measures the gas inside.
- This offline build does not read tag **text** (OCR needs megabytes of download
  and seconds per tag on a phone). Tag colour is what resolves a rack quickly.
- It is a pre-screening and counting aid, not a certified inspection.

## Status

On synthetic racks it counts 22/22 test cases exactly, including bottles
touching with no gap, a restraint chain across them, dim frames and noise. On
arbitrary real-world photographs it is far less reliable, and can occasionally
be right for the wrong reason — hence the trust indicator and the insistence on
checking the boxes.

Shawarma Prints. Licence: MIT.
