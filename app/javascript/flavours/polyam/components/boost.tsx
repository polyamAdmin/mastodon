import type {
  IconDefinition,
  IconName,
  IconPrefix,
} from '@fortawesome/free-solid-svg-icons';

/*
  This restores the old icon from FontAwesome4, including custom icons.
*/
export const prefix: IconPrefix = 'fas';
export const iconName: IconName = 'retweet';
export const width = 20;
export const height = 17;
export const aliases: string[] = [];
export const unicode = 'f079';

// Regular Boost icon
export const svgPathData =
  'M4.97 3.16c-.1.03-.17.1-.22.18L.8 8.24c-.2.3.03.78.4.8H3.6v2.68c0 4.26-.55 3.62 3.66 3.62h7.66l-2.3-2.84c-.03-.02-.03-.04-.05-.06H7.27c-.44 0-.72-.3-.72-.72v-2.7h2.5c.37.03.63-.48.4-.77L5.5 3.35c-.12-.17-.34-.25-.53-.2zm12.16.43c-.55-.02-1.32.02-2.4.02H7.1l2.32 2.85.03.06h5.25c.42 0 .72.28.72.72v2.7h-2.5c-.36.02-.56.54-.3.8l3.92 4.9c.18.25.6.25.78 0l3.94-4.9c.26-.28 0-.83-.37-.8H18.4v-2.7c0-3.15.4-3.62-1.25-3.66z';

// Reblog with lock
export const svgReblogPrivate =
  'M 4.9707031 3.1503906 L 4.9707031 3.1601562 C 4.8707031 3.1901563 4.8 3.2598438 4.75 3.3398438 L 0.80078125 8.2402344 C 0.60078125 8.5402344 0.8292187 9.0190625 1.1992188 9.0390625 L 3.5996094 9.0390625 L 3.5996094 11.720703 C 3.5996094 15.980703 3.0497656 15.339844 7.2597656 15.339844 L 11.869141 15.339844 L 11.869141 14.119141 L 11.869141 13.523438 L 11.869141 12.441406 C 11.869141 12.441406 11.869141 12.439453 11.869141 12.439453 L 7.2695312 12.439453 C 6.8295312 12.439453 6.5507814 12.140703 6.5507812 11.720703 L 6.5507812 9.0195312 L 9.0507812 9.0195312 C 9.4207813 9.0495313 9.6792188 8.54 9.4492188 8.25 L 5.5 3.3496094 C 5.38 3.1796094 5.1607031 3.1003906 4.9707031 3.1503906 z M 17.150391 3.5800781 L 17.130859 3.5898438 C 16.580859 3.5698436 15.810469 3.609375 14.730469 3.609375 L 7.0996094 3.609375 L 9.4199219 6.4609375 L 9.4492188 6.5195312 L 14.699219 6.5195312 C 15.106887 6.5195312 15.397113 6.7872181 15.414062 7.2050781 C 15.738375 7.0991315 16.077769 7.0273437 16.435547 7.0273438 L 16.578125 7.0273438 C 17.24903 7.0273438 17.874081 7.2325787 18.400391 7.578125 L 18.400391 7.2402344 C 18.400391 4.0902344 18.800391 3.6200781 17.150391 3.5800781 z M 16.435547 8.0273438 C 15.143818 8.0273438 14.083984 9.0851838 14.083984 10.376953 L 14.083984 11.607422 L 13.570312 11.607422 C 13.375448 11.607422 13.210603 11.704118 13.119141 11.791016 C 13.027691 11.877916 12.983569 11.958238 12.951172 12.03125 C 12.886382 12.177277 12.867187 12.304789 12.867188 12.441406 L 12.867188 13.523438 L 12.867188 14.119141 L 12.867188 15.677734 L 12.867188 16.509766 L 13.570312 16.509766 L 19.472656 16.509766 L 20.173828 16.509766 L 20.173828 15.677734 L 20.173828 13.523438 L 20.173828 12.441406 C 20.173828 12.304794 20.156597 12.177281 20.091797 12.03125 C 20.059397 11.95824 20.015299 11.877916 19.923828 11.791016 C 19.832368 11.704116 19.667509 11.607422 19.472656 11.607422 L 18.927734 11.607422 L 18.927734 10.376953 C 18.927734 9.0851838 17.867902 8.0273438 16.576172 8.0273438 L 16.435547 8.0273438 z M 16.435547 9.2207031 L 16.576172 9.2207031 C 17.22782 9.2207031 17.734375 9.7251013 17.734375 10.376953 L 17.734375 11.607422 L 15.277344 11.607422 L 15.277344 10.376953 C 15.277344 9.7251013 15.7839 9.2207031 16.435547 9.2207031 z M 12.919922 9.9394531 C 12.559922 9.9594531 12.359141 10.480234 12.619141 10.740234 L 12.751953 10.904297 C 12.862211 10.870135 12.980058 10.842244 13.085938 10.802734 L 13.085938 10.378906 C 13.085938 10.228632 13.111295 10.084741 13.130859 9.9394531 L 12.919922 9.9394531 z M 19.882812 9.9394531 C 19.902378 10.084741 19.927734 10.228632 19.927734 10.378906 L 19.927734 10.791016 C 20.168811 10.875098 20.455966 10.916935 20.613281 11.066406 C 20.691227 11.140457 20.749315 11.223053 20.806641 11.302734 L 21.259766 10.740234 C 21.519766 10.460234 21.260625 9.9094531 20.890625 9.9394531 L 19.882812 9.9394531 z M 16.435547 10.220703 C 16.301234 10.220703 16.277344 10.244432 16.277344 10.378906 L 16.277344 10.607422 L 16.734375 10.607422 L 16.734375 10.378906 C 16.734375 10.244433 16.712442 10.220703 16.578125 10.220703 L 16.435547 10.220703 z ';

// Boost with slash
export const svgReblogDisabled =
  'M 18.972656 1.2011719 C 18.829825 1.1881782 18.685932 1.2302188 18.572266 1.3300781 L 15.990234 3.5996094 C 15.58109 3.6070661 15.297269 3.609375 14.730469 3.609375 L 7.0996094 3.609375 L 9.4199219 6.4609375 L 9.4492188 6.5195312 L 12.664062 6.5195312 L 6.5761719 11.867188 C 6.5674697 11.818249 6.5507813 11.773891 6.5507812 11.720703 L 6.5507812 9.0195312 L 9.0507812 9.0195312 C 9.4207813 9.0495313 9.6792188 8.54 9.4492188 8.25 L 5.5 3.3496094 C 5.38 3.1796094 5.1607031 3.1003906 4.9707031 3.1503906 L 4.9707031 3.1601562 C 4.8707031 3.1901563 4.8 3.2598438 4.75 3.3398438 L 0.80078125 8.2402344 C 0.60078125 8.5402344 0.8292187 9.0190625 1.1992188 9.0390625 L 3.5996094 9.0390625 L 3.5996094 11.720703 C 3.5996094 13.045739 3.5690668 13.895038 3.6503906 14.4375 L 2.6152344 15.347656 C 2.3879011 15.547375 2.3754917 15.901081 2.5859375 16.140625 L 3.1464844 16.78125 C 3.3569308 17.020794 3.7101667 17.053234 3.9375 16.853516 L 19.892578 2.8359375 C 20.119911 2.6362188 20.134275 2.282513 19.923828 2.0429688 L 19.361328 1.4023438 C 19.256105 1.282572 19.115488 1.2141655 18.972656 1.2011719 z M 18.410156 6.7753906 L 15.419922 9.4042969 L 15.419922 9.9394531 L 14.810547 9.9394531 L 13.148438 11.400391 L 16.539062 15.640625 C 16.719062 15.890625 17.140313 15.890625 17.320312 15.640625 L 21.259766 10.740234 C 21.519766 10.460234 21.260625 9.9094531 20.890625 9.9394531 L 18.400391 9.9394531 L 18.400391 7.2402344 C 18.400391 7.0470074 18.407711 6.9489682 18.410156 6.7753906 z M 11.966797 12.439453 L 8.6679688 15.339844 L 14.919922 15.339844 L 12.619141 12.5 C 12.589141 12.48 12.590313 12.459453 12.570312 12.439453 L 11.966797 12.439453 z';

export const definition: IconDefinition = {
  prefix: prefix,
  iconName: iconName,
  icon: [width, height, aliases, unicode, svgPathData],
};

export const faBoost: IconDefinition = definition;

export const faBoostDisabled: IconDefinition = {
  prefix: prefix,
  iconName: iconName,
  icon: [width, height, aliases, unicode, svgReblogDisabled],
};

export const faBoostPrivate: IconDefinition = {
  prefix: prefix,
  iconName: iconName,
  icon: [width, height, aliases, unicode, svgReblogPrivate],
};