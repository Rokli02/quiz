const config = {
  base: '/quiz',
  route: {
    question: '/question',
    select: '/select',
    summary: '/summary',
  },
};

for (const route of Object.keys(config.route)) {
  (config.route as any)[route] = config.base + (config.route as any)[route];
}


export { config };
export default config;