"use client";

import { AnimatePresence, motion } from "framer-motion";

const PARTICLES = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: 10 + ((index * 17) % 80),
  delay: (index % 6) * 0.04,
  size: 6 + (index % 4) * 4,
  duration: 1.6 + (index % 5) * 0.18
}));

export function CelebrationOverlay({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.5rem]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-x-[20%] top-[22%] h-32 rounded-full bg-accent/20 blur-3xl"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
          {PARTICLES.map((particle) => (
            <motion.span
              key={particle.id}
              className="absolute top-1/2 rounded-full"
              style={{
                left: `${particle.left}%`,
                width: particle.size,
                height: particle.size,
                background:
                  particle.id % 2 === 0
                    ? "hsl(var(--accent))"
                    : "hsl(var(--secondary-accent))"
              }}
              initial={{ opacity: 0, y: 0, scale: 0.8 }}
              animate={{
                opacity: [0, 0.9, 0],
                y: [-10, -140 - particle.id * 4],
                x: [0, (particle.id % 2 === 0 ? -1 : 1) * (16 + particle.id * 3)],
                scale: [0.8, 1.05, 0.9]
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: [0.22, 1, 0.36, 1]
              }}
            />
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
