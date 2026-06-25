import { motion } from 'framer-motion';
import { CountUp } from './common/Motion';

const colorMap = {
  primary: 'bg-primary/10 text-primary',
  default: 'bg-surface-raised text-foreground-muted',
};

const StatCard = ({ label, value, icon: Icon, accent = 'default', delay = 0, suffix }) => {
  const isNumeric = typeof value === 'number';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className="card-matte p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="label-caps mb-3">{label}</p>
          <div className="flex items-baseline gap-1">
            <div className="text-3xl font-display font-bold text-foreground">
              {isNumeric ? <CountUp end={value} /> : value}
            </div>
            {suffix && <span className="text-sm font-medium text-foreground-muted">{suffix}</span>}
          </div>
        </div>
        {Icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg border border-surface-border ${colorMap[accent]}`}>
            <Icon className="h-4.5 w-4.5" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
