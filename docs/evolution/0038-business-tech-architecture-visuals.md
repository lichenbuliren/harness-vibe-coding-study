# Business Tech Architecture Visuals

## Stage

The project needed a clearer visual representation of its current architecture
and evolution after the learning loop, orchestration loop, and capability
discovery gate were added.

## Goal

Replace the earlier single-image draft with two deterministic, readable SVG
diagrams:

- a project architecture diagram
- a project evolution and learning-loop diagram

## Method

The previous draft was compared against the richer reference image. The
missing content was treated as a signal that the diagram needed a stronger
information architecture before any image-model polishing.

## Outcome

The visual direction moved to a business technology style with a dark technical
background, bounded panels, restrained accent colors, and manual text wrapping.
The final split keeps architecture and evolution separate so each diagram can
carry enough detail without forcing labels into cramped boxes.

## Artifacts

- `project-architecture-business-tech.svg`
- `project-evolution-business-tech.svg`
- PNG previews generated from the SVG sources

## Shareable Takeaway

For agent project architecture diagrams, use deterministic SVG first to lock
semantic structure and text layout. Use image models only after the information
architecture is stable.
