import { MoveTag, SquareId, TaggedSquareId } from '../types.ts';

type TagFn = (squareId: SquareId | SquareId[]) => TaggedSquareId[];
type TagOneFn = (squareId: SquareId) => TaggedSquareId;

const tagItems = <T>(item: T | T[], tag: MoveTag) =>
  (Array.isArray(item) ? item : [item]).map((x) => ({
    tag,
    id: x,
  }));
const tagItem = (item: SquareId, tag: MoveTag): TaggedSquareId => ({
  tag,
  id: item,
});

export const tagRegular: TagFn = (squareIds) => tagItems(squareIds, 'regular');
export const tagRegularOne: TagOneFn = (squareId) =>
  tagItem(squareId, 'regular');

export const tagCastle: TagFn = (squareIds) => tagItems(squareIds, 'castle');
export const tagCastleOne: TagOneFn = (squareId) => tagItem(squareId, 'castle');

export const tagEnPassant: TagFn = (squareIds) =>
  tagItems(squareIds, 'en-passant');
export const tagEnPassantOne: TagOneFn = (squareId) =>
  tagItem(squareId, 'en-passant');

export const tagPromotion: TagFn = (squareIds) =>
  tagItems(squareIds, 'promotion');
export const tagPromotionOne: TagOneFn = (squareId) =>
  tagItem(squareId, 'promotion');
