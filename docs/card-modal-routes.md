# Card Modal Routes

This doc describes how opening a card from the board is implemented using Next.js **parallel routes** and **intercepting routes**. Clicking a card opens a modal overlay (with shareable URL and back-button support) instead of navigating away from the board.

## Why this pattern

- **Shareable URLs** – `/boards/[boardId]/card/[cardId]` can be shared or bookmarked.
- **Back button** – Browser back closes the modal instead of leaving the board.
- **Refresh** – Refreshing on a card URL shows the card (full page when not intercepted).
- **One routing setup** – Modal and full-page card both use the same URL shape.

## Route structure

All of this lives under `app/(platform)/(dashbaord)/boards/[boardId]/`.

```
[boardId]/
├── layout.tsx              # Accepts children + modal slot, renders both
├── page.tsx                # Board page (uses BoardView)
├── @modal/
│   ├── default.tsx         # Renders null when no modal is open
│   └── (.)card/
│       └── [cardId]/
│           └── page.tsx   # Intercepted: card content rendered in modal slot
├── (.)card/
│   └── [cardId]/
│       └── page.tsx       # Intercepted: keeps board as main content
├── card/
│   └── [cardId]/
│       └── page.tsx       # Real route: full-page card (direct URL / refresh)
├── _components/
│   ├── board-view.tsx     # Shared board UI
│   ├── card-modal.tsx     # Modal overlay + card content (client)
│   └── list-card.tsx      # Card in list; Link to card route
└── _lib/
    └── get-board.ts       # Shared getBoardById()
```

## How it works

### 1. Layout and modal slot

`layout.tsx` receives both `children` and `modal` and renders them in the same tree:

```tsx
export default function BoardsIdLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  return (
    <TProvider>
      {children}
      {modal}
    </TProvider>
  );
}
```

When no card is open, `@modal/default.tsx` returns `null`, so `modal` is empty.

### 2. Intercepting from the board

When the user is on the board and clicks a card:

- The link goes to `/boards/[boardId]/card/[cardId]`.
- **`(.)card`** is an intercepting route: the `(.)` means “intercept the `card` segment at this level.”
- So two things are intercepted:
  - **Main tree** – `(.)card/[cardId]/page.tsx` runs and renders the **board** again (`BoardView`). So `children` stays the board.
  - **Modal tree** – `@modal/(.)card/[cardId]/page.tsx` runs and renders the **card** in the modal slot. So `modal` is the card overlay.

Result: URL is `/boards/[boardId]/card/[cardId]`, the board stays visible, and the card appears in a modal on top.

### 3. Direct URL or refresh

When the user opens `/boards/[boardId]/card/[cardId]` directly (or refreshes while on that URL):

- There is no “soft” navigation from the board, so the intercepting routes do **not** run.
- The **real** route `card/[cardId]/page.tsx` runs and is what the layout gets as `children`.
- `@modal` has no matching intercept, so `default.tsx` runs and `modal` is null.

Result: the card is shown as a full page (with “Back to board”), not as a modal.

### 4. Closing the modal

- **Back button** – History has board → card; back goes to board and the modal slot becomes null.
- **Overlay click / close** – `CardModal` calls `router.back()`, so behavior matches the back button.

## Data loading

**The modal does not get its data from the main page.** Each route loads what it needs:

- **Board (main page / intercepted main tree)** – Fetches the board and, in `BoardDndLists`, the lists with their cards. That data is only used for the board UI.
- **Modal route** – `@modal/(.)card/[cardId]/page.tsx` runs its own `getCard(cardId)` and fetches the single card (with `list.boardId`) from the database. That card is passed into `<CardModal card={card} />`.
- **Full-page card route** – `card/[cardId]/page.tsx` also fetches the card itself for direct URL / refresh.

So the modal and full-page card routes are independent server components: they don’t receive props or context from the board page. The board already has that card in its lists, but the modal doesn’t reuse that; it refetches by `cardId`. That keeps the implementation simple and works for direct URLs and refresh, where there is no “main page” in the same request.

## Key files

| File | Purpose |
|------|--------|
| `layout.tsx` | Renders `children` and `modal` so the modal can overlay the board. |
| `@modal/default.tsx` | Renders nothing when no modal route is active. |
| `@modal/(.)card/[cardId]/page.tsx` | Fetches card, renders `<CardModal card={card} />` in the modal slot. |
| `(.)card/[cardId]/page.tsx` | Fetches board (via card’s list), renders `<BoardView board={board} />` so the board stays behind the modal. |
| `card/[cardId]/page.tsx` | Full-page card view for direct URL / refresh. |
| `_components/card-modal.tsx` | Client component: backdrop + card content, `router.back()` on close. |
| `_components/board-view.tsx` | Shared board UI used by the board page and the intercepting route. |
| `_components/list-card.tsx` | Renders a `Link` to `/boards/[boardId]/card/[card.id]`; title click still triggers inline edit. |

## List card behavior

- **Click card (outside title)** – Navigates to the card route; from the board this opens the modal.
- **Click title** – `stopPropagation` + inline edit; no navigation.
- **While editing** – The card is wrapped in a non-link div so blur/outside click doesn’t navigate.

## References

- [Next.js Parallel Routes](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)
- [Next.js Intercepting Routes](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes)
