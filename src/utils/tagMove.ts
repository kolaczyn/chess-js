import {
  MoveTagWithoutTarget,
  SquareId,
  TaggedSquareId,
  TaggedSquareIdNoTarget,
} from '../types.ts';

type TagFn = (squareId: SquareId | SquareId[]) => TaggedSquareId[];
type TagOneFn = (squareId: SquareId) => TaggedSquareId;

export const tagMoves = <T>(item: T | T[], tag: MoveTagWithoutTarget) =>
  (Array.isArray(item) ? item : [item]).map((x) => ({
    tag,
    id: x,
  }));

export const tagMove = (
  item: SquareId,
  tag: MoveTagWithoutTarget,
): TaggedSquareIdNoTarget => ({
  tag,
  id: item,
});

export const tagRegular: TagFn = (squareIds) => tagMoves(squareIds, 'regular');
export const tagRegularOne: TagOneFn = (squareId) =>
  tagMove(squareId, 'regular');
