---
version: alpha
name: Phrase Cards
description: A quiet language-learning flashcard app for memorizing everyday phrases.
colors:
  primary: "#3A332B"
  primaryText: "#F7F5F0"
  accent: "#6B5836"
  warning: "#8A5A00"
  text: "#2A2622"
  textMuted: "#6E655A"
  textSubtle: "#9A9085"
  background: "#F7F5F0"
  surface: "#FDFBF7"
  surfaceMuted: "#F1ECE2"
  border: "#E3DCCE"
  borderStrong: "#CFC5B2"
  mastered: "#566B3C"
  masteredTint: "#E9EBD6"
  masteredBorder: "#CDD3AE"
  review: "#9A5A3A"
  reviewTint: "#F2E6DC"
  reviewBorder: "#E0C9B6"
typography:
  title:
    fontFamily: system
    fontSize: 22px
    fontWeight: 700
    lineHeight: 30px
  section-title:
    fontFamily: system
    fontSize: 16px
    fontWeight: 700
  body:
    fontFamily: system
    fontSize: 14px
    fontWeight: 400
    lineHeight: 21px
  label:
    fontFamily: system
    fontSize: 12px
    fontWeight: 700
  card-front:
    fontFamily: system
    fontSize: 24px
    fontWeight: 800
rounded:
  sm: 4px
  md: 6px
  pill: 999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
components:
  screen:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
  card:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    borderRadius: "{rounded.md}"
  input:
    backgroundColor: "{colors.surfaceMuted}"
    borderColor: "{colors.borderStrong}"
    borderRadius: "{rounded.sm}"
    textColor: "{colors.text}"
  primary-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primaryText}"
    borderRadius: "{rounded.sm}"
  secondary-button:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.borderStrong}"
    textColor: "{colors.text}"
    borderRadius: "{rounded.sm}"
  lang-toggle:
    backgroundColor: "{colors.surface}"
    activeBackgroundColor: "{colors.primary}"
    activeTextColor: "{colors.primaryText}"
    borderRadius: "{rounded.pill}"
  progress-bar:
    trackColor: "{colors.surfaceMuted}"
    fillColor: "{colors.mastered}"
  state-tag-mastered:
    backgroundColor: "{colors.masteredTint}"
    borderColor: "{colors.masteredBorder}"
    textColor: "{colors.mastered}"
    borderRadius: "{rounded.sm}"
  state-tag-review:
    backgroundColor: "{colors.reviewTint}"
    borderColor: "{colors.reviewBorder}"
    textColor: "{colors.review}"
    borderRadius: "{rounded.sm}"
---

# Phrase Cards Design System

## Overview

Phrase Cards is a practical language-learning flashcard app. It should feel closer to a paper vocabulary notebook and a stack of study cards than a promotional AI demo. The palette is warm and paper-like — an off-white background with ink-brown text and controls, no blue — so the screen reads like a printed notebook rather than a SaaS dashboard. The main action is flipping a card and honestly marking whether the phrase is remembered.

## Principles

- Use compact Japanese labels. Avoid marketing copy and oversized hero text.
- Keep the card itself the clear center of the screen. One phrase at a time, with plenty of quiet space around it.
- Stay within a warm, low-saturation range: ink-brown for primary text and buttons, muted moss for "覚えた" (mastered), muted terracotta for "まだ" (review). Avoid blue and bright accent colors.
- Show learning state with small text tags, not color alone: "覚えた" uses a muted moss tone, "まだ" uses a muted terracotta tone, and each tag always carries text (see Accessibility).
- Make progress scannable: a single thin progress bar plus a plain "覚えた N / 全体 M" count. No charts or gamified badges in the MVP.
- Keep the UI quiet. No gradients, no decorative cards, no chatty explanation blocks.
- Treat the phrase list as editable content the user owns. Adding and editing cards should feel as simple as writing in a notebook.

## Layout

Use a single-column mobile layout. Top: app title, language toggle (英語 / ドイツ語), and a progress bar with count. Center: one large study card that flips between the Japanese front and the translated back, with a pronunciation button on the back. Below the card: the two judgment buttons ("まだ" / "覚えた"). The end-of-deck result screen shows the mastered and review counts and offers "全部もう一度" and "「まだ」だけ復習".

Keep the study card at `6px` radius and inputs/buttons at `4px` radius; the language toggle uses a pill shape. Avoid nested cards and oversized rounded panels.

## Typography

Use the platform system font. The phrase on the card front uses `card-front` (large, bold) so it dominates the card. Titles orient but should not dominate the screen; supporting copy and labels stay small and restrained.

## Components

Primary buttons use `primary-button` tokens and appear for the positive action ("覚えた", "全部もう一度"). Secondary actions ("まだ", "「まだ」だけ復習") use `secondary-button`. The language toggle uses `lang-toggle` with the active language filled in ink-brown. The progress bar fills with the mastered (moss) tone. Learning-state tags use `state-tag-mastered` / `state-tag-review`. A future card add/edit form uses `input` tokens with visible labels for 日本語 (front), translation (back), language, and category.

## Accessibility

Maintain high contrast for the card phrase and action buttons. Do not rely on color alone for learning state; always include text such as "覚えた" or "まだ". Keep touch targets at least `44px` high so the card and buttons are easy to tap on a phone.
