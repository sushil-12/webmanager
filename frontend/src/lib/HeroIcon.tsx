import * as HeroIcons from "@heroicons/react/24/solid"; // Import all solid icons

/**
 * Dynamically converts a string to its corresponding Heroicons component
 * @param {string} iconName - The icon name in kebab-case (e.g., 'check-circle').
 * @returns {JSX.Element | null} - The corresponding Heroicons component or null if not found.
 */
export function getHeroIcon(iconName: string): JSX.Element | null {
  if (!iconName) return null;

  // Convert kebab-case to PascalCase (e.g., 'check-circle' -> 'CheckCircleIcon')
//   const componentName = iconName
//     .split("-")
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join("") + "Icon";

  // Dynamically fetch the component from the imported icons
  const IconComponent = (HeroIcons as Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>)?.[iconName];

  // Return the component if found, otherwise null
  return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
}
