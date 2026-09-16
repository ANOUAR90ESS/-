export interface BaseRatingInfo {
  baseScore: number;
  baseCount: number;
}

// التقييمات الافتراضية الأولية المستندة لآراء المجتمع لكل فكرة مشروع
export const DEFAULT_PROJECT_RATINGS: Record<string, BaseRatingInfo> = {
  'social-media-management': { baseScore: 4.8, baseCount: 68 },
  'gift-boxes-packaging': { baseScore: 4.7, baseCount: 52 },
  'cleaning-services-booking': { baseScore: 4.6, baseCount: 41 },
  'digital-products-templates': { baseScore: 4.9, baseCount: 94 },
  'home-bakery-specialty': { baseScore: 4.8, baseCount: 63 },
  'car-wash-at-doorstep': { baseScore: 4.7, baseCount: 57 },
  'ecommerce-micro-import': { baseScore: 4.5, baseCount: 48 },
  'home-decluttering-organization': { baseScore: 4.8, baseCount: 39 },
  'online-tutoring-micro-courses': { baseScore: 4.9, baseCount: 81 },
};

export interface CalculatedRating {
  average: number;
  count: number;
  userRating: number | null;
}

/**
 * حساب التقييم النهائي للمشروع بدمج تقييم المستخدم المخزن مع التقييمات الأساسية
 */
export function calculateProjectRating(
  projectId: string,
  userRatings: Record<string, number>
): CalculatedRating {
  const base = DEFAULT_PROJECT_RATINGS[projectId] || { baseScore: 4.6, baseCount: 30 };
  const userRating = userRatings[projectId] || null;

  if (userRating) {
    const totalScore = base.baseScore * base.baseCount + userRating;
    const totalCount = base.baseCount + 1;
    const avg = Math.round((totalScore / totalCount) * 10) / 10;
    return {
      average: avg,
      count: totalCount,
      userRating,
    };
  }

  return {
    average: base.baseScore,
    count: base.baseCount,
    userRating: null,
  };
}
