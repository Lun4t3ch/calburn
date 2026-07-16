/**
 * "Did you know?" insight soundbites, every claim fact-checked against a
 * primary source during the research phase. `anchor` decides which section a
 * tip appears next to; `source` is the evidence basis (shown on the tip).
 */

export type InsightAnchor =
  | 'profile' // near the basics (BMR-related)
  | 'activity' // near job/movement/workouts (NEAT/EAT)
  | 'advanced' // near macros/TEF
  | 'results' // near the burn breakdown
  | 'plan' // near goal/intake/weight change
  | 'motivation' // behavioral / encouraging

export interface Insight {
  id: string
  text: string
  source: string
  anchor: InsightAnchor
  /** motivational tips have no hard science claim to cite */
  motivational?: boolean
}

export const INSIGHTS: Insight[] = [
  // ---- Physiology (results / activity / profile)
  {
    id: 'neat-variable',
    text: 'The calories you burn just moving around, not working out, vary more between people than anything else, by up to ~2,000 kcal a day.',
    source: 'Levine, NEAT research (J Intern Med 2007)',
    anchor: 'activity',
  },
  {
    id: 'muscle-burn',
    text: 'A pound of muscle burns only about 6 kcal a day at rest, not the 50 you often hear. Muscle helps, but modestly.',
    source: 'Elia 1992; Wang et al., Am J Clin Nutr 2010',
    anchor: 'results',
  },
  {
    id: 'protein-tef',
    text: 'Protein has the highest "thermic effect", you burn 20 to 30% of its calories just digesting it, vs 5 to 10% for carbs and 0 to 3% for fat.',
    source: 'Westerterp, Nutr Metab 2004',
    anchor: 'advanced',
  },
  {
    id: 'bmr-share',
    text: 'Your resting metabolism is usually 60 to 70% of everything you burn, the biggest and most stable slice of your day.',
    source: 'TDEE component literature',
    anchor: 'results',
  },
  {
    id: 'brain-burn',
    text: 'Your brain alone uses about 20% of your resting calories, thinking is surprisingly expensive.',
    source: 'Elia 1992 organ metabolic rates',
    anchor: 'results',
  },
  {
    id: 'adaptation',
    text: 'When you diet, your metabolism drops a bit more than your weight loss alone predicts. That "adaptive" dip is why plateaus happen, it is normal.',
    source: 'Fothergill et al., Obesity 2016',
    anchor: 'plan',
  },
  {
    id: 'standing',
    text: 'Standing instead of sitting burns only ~0.15 kcal per minute more, real gains come from actually moving, not just standing.',
    source: 'Saeidifard et al. meta-analysis, 2018',
    anchor: 'activity',
  },

  // ---- Hidden calories (advanced / plan)
  {
    id: 'label-tolerance',
    text: 'Food-label calories can legally read up to about 20% lower than what is actually in the food.',
    source: 'US FDA, 21 CFR 101.9',
    anchor: 'plan',
  },
  {
    id: 'underreporting',
    text: 'People underestimate how much they eat by 20 to 50% on average, even trained dietitians do it.',
    source: 'Lichtman et al., NEJM 1992',
    anchor: 'plan',
  },
  {
    id: 'cooking-oil',
    text: 'One tablespoon of cooking oil is about 120 kcal, the most commonly forgotten "invisible" calories in home cooking.',
    source: 'USDA FoodData Central',
    anchor: 'advanced',
  },
  {
    id: 'liquid-calories',
    text: 'Liquid calories, soda, juice, alcohol, barely register with your appetite, so you do not eat less later to make up for them.',
    source: 'DiMeglio & Mattes, Int J Obes 2000',
    anchor: 'advanced',
  },
  {
    id: 'alcohol',
    text: 'Alcohol carries 7 kcal per gram with no nutrition, and your body pauses fat burning while it deals with it.',
    source: 'Westerterp, Nutr Metab 2004',
    anchor: 'advanced',
  },
  {
    id: 'tracker-overestimate',
    text: 'Fitness trackers and cardio machines usually overstate calories burned, treat "calories burned" as a rough guide, not a bank balance.',
    source: 'Wearable-device validation studies',
    anchor: 'activity',
  },

  // ---- Weight change (plan)
  {
    id: 'linear-myth',
    text: 'The old "3,500 kcal = 1 pound" rule overpredicts long-term loss, because your metabolism shrinks as you do. Slower and steadier wins.',
    source: 'Hall et al., Lancet 2011',
    anchor: 'plan',
  },
  {
    id: 'safe-rate',
    text: 'A safe, sustainable fat-loss pace is about 0.5 to 1% of your bodyweight per week, faster usually means losing muscle and water too.',
    source: 'ISSN / ACSM position stands',
    anchor: 'plan',
  },
  {
    id: 'muscle-slow',
    text: 'Building muscle is slow, even trained lifters gain only a few pounds of muscle a year. Patience beats bulking fast.',
    source: 'Aragon / body-recomposition literature',
    anchor: 'plan',
  },

  // ---- Nutrition strategy (advanced)
  {
    id: 'protein-target',
    text: 'Aim for about 1.6 to 2.2 g of protein per kg of bodyweight to build or keep muscle, much more than that adds little for most people.',
    source: 'Morton et al. meta-analysis, Br J Sports Med 2018',
    anchor: 'advanced',
  },
  {
    id: 'protein-cutting',
    text: 'Keeping protein high while cutting calories protects your muscle and keeps you fuller for longer.',
    source: 'Leidy et al. 2007, 2015',
    anchor: 'plan',
  },

  // ---- Behaviour / motivation
  {
    id: 'self-monitoring',
    text: 'Simply writing down what you eat is one of the strongest predictors of weight-loss success, awareness beats willpower.',
    source: 'Burke et al. systematic review, 2011',
    anchor: 'motivation',
  },
  {
    id: 'habit-66',
    text: 'New habits take about 66 days on average to feel automatic (anywhere from 18 to 254), and missing a single day does not break the habit.',
    source: 'Lally et al., Eur J Soc Psychol 2010',
    anchor: 'motivation',
  },
  {
    id: 'consistency',
    text: 'Consistency beats perfection: small changes you can keep forever outperform aggressive plans you abandon in a month.',
    source: 'Behavioral weight-loss literature',
    anchor: 'motivation',
  },
  {
    id: 'brushing-teeth',
    text: 'Eating healthy is like brushing your teeth: if you forget one day, that is okay, you do not quit, you just start again the next day.',
    source: 'CalBurn',
    anchor: 'motivation',
    motivational: true,
  },
  {
    id: 'environment',
    text: 'Your surroundings shape how much you eat, smaller plates, pre-portioned servings, and keeping treats out of sight all quietly help.',
    source: 'Hollands et al., Cochrane Review 2015',
    anchor: 'motivation',
  },
]

/** Insights for a given section that the user hasn't dismissed. */
export function insightsFor(anchor: InsightAnchor, dismissed: string[]): Insight[] {
  return INSIGHTS.filter((i) => i.anchor === anchor && !dismissed.includes(i.id))
}
