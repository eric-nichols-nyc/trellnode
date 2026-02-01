import { prisma } from "@/prisma";
import { connectToDatabase } from "@/lib/db";

const DEFAULT_BOARD_TITLE = "Simple Project Board";

const DEFAULT_BOARD_IMAGE_URL =
  "https://4jhrlg6rm1.ufs.sh/f/U6YzDNnXqiW9ynYiwRyangYy9zWV5L871roOhtuwxbEBaAkS";

/** Default board background image (same URL for thumb and full) */
const DEFAULT_BOARD_IMAGE = {
  imageId: "default-board",
  imageThumbUrl: DEFAULT_BOARD_IMAGE_URL,
  imageFullUrl: DEFAULT_BOARD_IMAGE_URL,
  imageLinkHTML: DEFAULT_BOARD_IMAGE_URL,
  imageUserName: "Default",
  imagePrimaryColor: "#023020",
};

const DEFAULT_LISTS = [
  { title: "BRAINSTORM", order: 0 },
  { title: "TODO", order: 1 },
  { title: "DOING", order: 2 },
  { title: "DONE!", order: 3 },
] as const;

const DEFAULT_CARD_TITLES = [
  "Add what you'd like to work on below",
  "Move anything 'ready' here",
  "Move anything that is actually started here",
  "Move anything from doing to done here",
] as const;

/** Card image URLs: 1=BRAINSTORM, 2=TODO, 3=DOING, 4=DONE! */
const DEFAULT_CARD_IMAGE_URLS = [
  "https://4jhrlg6rm1.ufs.sh/f/U6YzDNnXqiW9W1hNdc68f3xVgk1L7MNolzTYnFywrGJZcvHj",
  "https://4jhrlg6rm1.ufs.sh/f/U6YzDNnXqiW9SsBpvGOPkgLnJWO4bG8yslpEV9Ah7oidazrU",
  "https://4jhrlg6rm1.ufs.sh/f/U6YzDNnXqiW9SqHYAfOPkgLnJWO4bG8yslpEV9Ah7oidazrU",
  "https://4jhrlg6rm1.ufs.sh/f/U6YzDNnXqiW9TFakMB1yCprJGFWl6sg0Zi91DzSa2xtuMBQh",
] as const;

/**
 * Creates a default board for a newly signed-up user: one board with four lists
 * (BRAINSTORM, TODO, DOING, DONE!) and one card in each list.
 * Call this after creating a user in both the signup action and NextAuth signIn callback.
 */
export async function createDefaultBoardForUser(userId: string): Promise<void> {
  await connectToDatabase();

  const image = DEFAULT_BOARD_IMAGE;

  const board = await prisma.board.create({
    data: {
      title: DEFAULT_BOARD_TITLE,
      userId,
      imageId: image.imageId,
      imageThumbUrl: image.imageThumbUrl,
      imageFullUrl: image.imageFullUrl,
      imageLinkHTML: image.imageLinkHTML,
      imageUserName: image.imageUserName,
      imagePrimaryColor: image.imagePrimaryColor,
    },
  });

  for (let i = 0; i < DEFAULT_LISTS.length; i++) {
    const listConfig = DEFAULT_LISTS[i];
    const list = await prisma.list.create({
      data: {
        title: listConfig.title,
        order: listConfig.order,
        boardId: board.id,
      },
    });

    await prisma.card.create({
      data: {
        title: DEFAULT_CARD_TITLES[i],
        order: 0,
        listId: list.id,
        imageUrl: DEFAULT_CARD_IMAGE_URLS[i],
      },
    });
  }
}
