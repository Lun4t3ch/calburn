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

  // ==== Exercise vs diet (activity) ====
  {
    id: 'nutrition-first',
    text: 'Weight loss comes mostly from nutrition. Exercise is still essential, it protects muscle, improves health, and helps keep the weight off.',
    source: 'ACSM 2024; Cochrane 2021',
    anchor: 'activity',
  },
  {
    id: 'outexercise',
    text: "You can't out-exercise a poor diet. It is far easier to eat calories than to burn them off.",
    source: 'ACSM 2024',
    anchor: 'activity',
  },
  {
    id: 'combine-training',
    text: 'Combine strength training with cardio: cardio builds fitness and burns calories, strength training preserves muscle and improves your shape.',
    source: 'ACSM 2024',
    anchor: 'activity',
  },
  {
    id: 'fasted-cardio',
    text: "Fasted cardio doesn't give greater long-term fat loss. Train in whatever way keeps you consistent.",
    source: 'JISSN 2014',
    anchor: 'activity',
  },
  {
    id: 'spot-reduce',
    text: "You can't spot-reduce fat. It comes off across your whole body based on genetics and overall energy balance, not the muscle you train.",
    source: 'ACSM',
    anchor: 'activity',
  },

  // ==== Physiology (results) ====
  {
    id: 'sweat-water',
    text: 'Sweating means you are losing water, not body fat. Rehydrate and the weight comes right back.',
    source: 'ACSM',
    anchor: 'results',
  },

  // ==== Macros & food quality (advanced) ====
  {
    id: 'carbs-not-fattening',
    text: "Carbohydrates don't make you fat, excess calories do. Whole grains, fruit, vegetables and legumes are linked to better health.",
    source: 'NEJM 2013',
    anchor: 'advanced',
  },
  {
    id: 'fats-not-fattening',
    text: "Healthy fats don't make you fat. Nuts, olive oil, seeds and fatty fish support your health despite being calorie-dense.",
    source: 'NEJM 2013',
    anchor: 'advanced',
  },
  {
    id: 'healthy-still-calories',
    text: 'Healthy food still has calories. Portion size matters even for nutritious things like nuts, avocado and olive oil.',
    source: 'NEJM 2013',
    anchor: 'advanced',
  },
  {
    id: 'anabolic-window',
    text: 'The "anabolic window" is much wider than people think. Hitting your daily protein target matters far more than a shake right after training.',
    source: 'ISSN 2013',
    anchor: 'advanced',
  },
  {
    id: 'protein-everyone',
    text: 'Protein matters for everyone, not just lifters. It preserves muscle during weight loss, aids recovery, and keeps you fuller.',
    source: 'ISSN 2017',
    anchor: 'advanced',
  },

  // ==== Supplements (advanced) ====
  {
    id: 'protein-powder',
    text: 'Protein powder is just convenient food, a cheap, easy way to hit your protein target. It is no better than protein from whole foods.',
    source: 'ISSN 2017',
    anchor: 'advanced',
  },
  {
    id: 'protein-bars',
    text: 'Treat protein bars as convenience snacks, not health food. Many carry as many calories as a candy bar.',
    source: 'Academy of Nutrition & Dietetics',
    anchor: 'advanced',
  },
  {
    id: 'creatine',
    text: 'If you supplement, plain creatine monohydrate is one of the safest, most effective options for strength. Fancier forms have not shown better results.',
    source: 'ISSN 2022',
    anchor: 'advanced',
  },
  {
    id: 'caffeine',
    text: 'Caffeine is one of the few supplements with strong evidence: it can improve endurance, strength, power and focus, and lower perceived effort.',
    source: 'ISSN 2021',
    anchor: 'advanced',
  },
  {
    id: 'other-supplements',
    text: 'Most other supplements give only small gains. Beta-alanine, citrulline, nitrates and the rest rarely justify the cost for recreational lifters.',
    source: 'AIS Supplement Framework; ISSN',
    anchor: 'advanced',
  },
  {
    id: 'fundamentals-first',
    text: 'Nail the fundamentals before supplements: good food, enough protein, resistance training, activity, sleep and consistency deliver nearly all your results.',
    source: 'ACSM; ISSN',
    anchor: 'advanced',
  },

  // ==== Calorie balance & weight change (plan) ====
  {
    id: 'deficit-required',
    text: 'A calorie deficit is required to lose body fat. No food or diet trick gets around this basic principle.',
    source: 'Hall & Guo, Obesity 2017',
    anchor: 'plan',
  },
  {
    id: 'no-best-diet',
    text: 'There is no single best diet. Low-carb, low-fat, Mediterranean, keto and fasting all work if they help you hold a calorie deficit.',
    source: 'JAMA 2014; DIETFITS, JAMA 2018',
    anchor: 'plan',
  },
  {
    id: 'meal-timing',
    text: 'Meal timing matters far less than your total daily nutrition. Breakfast, late dinners, or six small meals barely matter next to calories and protein.',
    source: 'NEJM 2013; ISSN 2017',
    anchor: 'plan',
  },
  {
    id: 'daily-fluctuation',
    text: 'Your weight jumps around day to day from water and food. Judge progress by the multi-week trend, your waist, and your strength, not one weigh-in.',
    source: 'Obesity Reviews 2016',
    anchor: 'plan',
  },
  {
    id: 'recomp',
    text: 'You can improve your body composition without the scale moving much. Losing fat while gaining muscle is common, especially for beginners.',
    source: 'Cochrane 2021',
    anchor: 'plan',
  },
  {
    id: 'rapid-loss-ok',
    text: "Fast early weight loss isn't necessarily bad. Done through sustainable habits, it can actually predict better long-term success.",
    source: 'NEJM 2013',
    anchor: 'plan',
  },
  {
    id: 'maintenance-harder',
    text: 'Keeping weight off is harder than losing it: afterwards your body is hungrier and burns a little less, so habits matter more than willpower.',
    source: 'Sumithran et al., NEJM 2011',
    anchor: 'plan',
  },

  // ==== Behaviour & mindset (motivation) ====
  {
    id: 'best-diet-sustainable',
    text: 'The best diet is the one you can follow for years. Flexible eating you can sustain beats a strict plan you quit.',
    source: 'American Heart Association 2021',
    anchor: 'motivation',
  },
  {
    id: 'no-food-banned',
    text: 'Let whole foods make up most of your diet, but no single food needs to be off-limits. Moderation lasts longer than restriction.',
    source: 'American Heart Association 2021',
    anchor: 'motivation',
  },
  {
    id: 'systems-over-motivation',
    text: 'Motivation fades, systems last. People who succeed lean on routines and an environment that makes the healthy choice the easy one.',
    source: 'Annual Review of Psychology 2007',
    anchor: 'motivation',
  },
  {
    id: 'one-meal',
    text: "One meal won't ruin your progress. Your results reflect months of habits, not any single plate of food.",
    source: 'Behavioral weight-management research',
    anchor: 'motivation',
  },
  {
    id: 'habits-compound',
    text: 'Small daily habits compound into big results. Consistency beats perfection every single time.',
    source: 'Diabetes Prevention Program',
    anchor: 'motivation',
  },
]

/** Insights for a given section that the user hasn't dismissed. */
export function insightsFor(anchor: InsightAnchor, dismissed: string[]): Insight[] {
  return INSIGHTS.filter((i) => i.anchor === anchor && !dismissed.includes(i.id))
}
