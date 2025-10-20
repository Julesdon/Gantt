import type { Link } from '../types/domain';

export type LinkRoute = {
  id: string | number;
  points: { x: number; y: number }[];
  link: Link;
};

export class LinksController {
  links: Link[];

  constructor(links: Link[] = []) {
    this.links = links;
  }

  computeRoutes(getBarById: (id: string | number) => { x: number; y: number; width: number; height: number } | null) {
    return this.links.map((l) => {
      const from = getBarById(l.from) || { x: 0, y: 0, width: 0, height: 0 };
      const to = getBarById(l.to) || { x: 0, y: 0, width: 0, height: 0 };
      const start = { x: from.x + from.width, y: from.y + from.height / 2 };
      const end = { x: to.x, y: to.y + to.height / 2 };
      return { id: l.id, points: [start, end], link: l } as LinkRoute;
    });
  }
}
