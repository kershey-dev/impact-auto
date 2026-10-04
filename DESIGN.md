---
name: Auto Movers
description: A cinematic repair story made from actual before and after photographs.
colors:
  paper: "#f3f1ea"
  ink: "#101518"
  blue: "#113a57"
  red: "#d73532"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(64px, 8.4vw, 132px)"
    fontWeight: 800
    lineHeight: 0.91
    letterSpacing: "-0.055em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
rounded:
  square: "0px"
spacing:
  gutter: "clamp(24px, 5.3vw, 90px)"
components:
  button-primary:
    backgroundColor: "{colors.red}"
    textColor: "{colors.white}"
    rounded: "{rounded.square}"
    padding: "12px 18px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.square}"
    padding: "12px 18px"
---

# Design System: Auto Movers

## Overview

The approved restoration storyboard is the page anchor. The first viewport places large uppercase type over a dark, nearly full-bleed damaged utility vehicle. Scrolling reveals the repaired photo and replaces the headline with “Restored. Road-ready.” The site then moves through an accident CTA, dark repair portfolio, paper service list, seven-stage dark process, insurance guidance, and blue photo estimate preview. Use only real repair images supplied by the user; they have different camera angles and limited resolution.

## Colors

Graphite frames damage, repair proof, and the journey. Paper separates the conversion and explanation sections. Blue identifies the estimate section. Red is the primary action and active progress color. Frontmatter defines the actual palette.

## Typography

Manrope 800 is compressed horizontally for the uppercase hero block to evoke workshop lettering. Other headings remain heavy but use natural width. Manrope 400 carries body text; labels stay readable at 12px or larger.

## Layout

The hero stays pinned across 255dvh on desktop while the photo and headline change. The repair process stays pinned across 420dvh and selects seven stages. Sections use a fluid gutter and asymmetric grids. Navigation folds at 1000px; at 760px the content stacks, process buttons become direct controls, and the persistent contact actions appear once the hero leaves view.

## Elevation & Depth

There are no content card shadows. Full-width tonal changes and actual photography provide depth. A scan line marks the image reveal.

## Shapes

Rectangular images, square inputs, square buttons, and thin dividers. No rounded gallery cards.

## Components

The hero comparison is scroll controlled and also has a native button to toggle the image. Repair examples have reversible “See before” switches. Services swap contextual imagery by pointer and keyboard focus. The seven process buttons update a single real repair sequence; scroll advances them on desktop. The estimate surface previews photos and fields locally and explicitly does not submit an enquiry.

## Do's and Don'ts

- **Do** preserve the supplied photographs and label comparisons honestly.
- **Do** keep the changing hero headline and a useful reduced-motion path.
- **Do** give the user a clear route to an estimate at each meaningful stage.
- **Don't** imply insurance approval, completed enquiry delivery, or pixel-aligned before/after frames.
