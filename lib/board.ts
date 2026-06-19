export function getBoardId(): string {
  const boardId = process.env.TRELLO_BOARD_ID?.trim();
  if (!boardId) {
    throw new Error("TRELLO_BOARD_ID is not configured");
  }
  return boardId;
}
