// components/AvatarPlaceholder.tsx
interface AvatarPlaceholderProps {
  initials?: string;
  name: string;
  size?: "sm" | "md" | "lg";
}

const AvatarPlaceholder = ({
  initials,
  name,
  size = "lg",
}: AvatarPlaceholderProps) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
  };

  const displayInitials =
    initials ||
    name
      .split(" ")
      .filter((part) => part.length > 0)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div
      className={`rounded-full bg-amber-600 flex items-center justify-center text-white font-bold ${sizeClasses[size]}`}
      aria-label={`Avatar for ${name}`}
    >
      {displayInitials}
    </div>
  );
};

export default AvatarPlaceholder;
