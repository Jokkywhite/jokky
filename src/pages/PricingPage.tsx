import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const plans = [
  {
    tier: 'pricing.starter',
    price: '$14',
    monthly: true,
    perks: [
      'pricing.perks.starterBasicEditingTools',
      'pricing.perks.starterProjectSlot',
      'pricing.perks.starterExport720p',
      'pricing.perks.starterAIPreview',
    ],
  },
  {
    tier: 'pricing.pro',
    price: '$29',
    monthly: true,
    perks: [
      'pricing.perks.proUnlimitedProjects',
      'pricing.perks.pro1080pExport',
      'pricing.perks.proTimelinePresets',
      'pricing.perks.proAIAssistant',
    ],
  },
  {
    tier: 'pricing.agency',
    price: '$59',
    monthly: true,
    perks: [
      'pricing.perks.agency4KExport',
      'pricing.perks.agencyTeamWorkflow',
      'pricing.perks.agencyPrioritySupport',
      'pricing.perks.agencyCloudSavePreview',
    ],
  },
];

export default function PricingPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10">
      <section className="glass-panel rounded-[36px] border border-white/10 p-8 shadow-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">{t('pricing.pricingIntro')}</p>
        <h2 className="mt-4 text-4xl font-semibold text-white">{t('pricing.headline')}</h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">{t('pricing.description')}</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <motion.div
            key={plan.tier}
            whileHover={{ y: -6 }}
            className="glass-panel rounded-[36px] border border-white/10 p-8 shadow-xl"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">{t(plan.tier)}</p>
            <p className="mt-6 text-5xl font-semibold text-white">{plan.price}</p>
            <p className="text-sm uppercase tracking-[0.3em] text-white/40">{t('pricing.monthly')}</p>
            <div className="mt-8 space-y-4">
              {plan.perks.map((perk) => (
                <div key={perk} className="rounded-3xl border border-white/10 bg-[#0d1120]/90 px-4 py-3 text-white/70">
                  {t(perk)}
                </div>
              ))}
            </div>
            <button className="mt-8 w-full rounded-3xl bg-accent px-6 py-4 text-sm font-semibold text-white transition hover:bg-violet-400">
              {t('pricing.choosePlan', { tier: t(plan.tier) })}
            </button>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
