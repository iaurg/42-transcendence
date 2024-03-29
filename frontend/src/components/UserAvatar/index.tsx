type UserAvatarProps = {
  imageUrl: string;
  login: string;
};

export default function UserAvatar({ imageUrl, login }: UserAvatarProps) {
  // check if imageUrl is a link
  if (imageUrl?.includes("http")) {
    return (
      <img
        src={imageUrl}
        alt="avatar"
        width={40}
        height={40}
        className="rounded-full"
      />
    );
  }

  if (imageUrl) {
    // TODO: change to next/image when all urls comes from our server
    return (
      <img
        src={`${process.env.NEXT_PUBLIC_API_URL}/avatars/${imageUrl}`}
        alt="avatar"
        width={40}
        height={40}
        className="rounded-full"
      />
    );
  }

  return (
    <div className="rounded-full bg-purple42-200 w-10 h-10 flex justify-center items-center">
      <span className="text-white text-2xl">
        {login && login[0].toLocaleUpperCase()}
      </span>
    </div>
  );
}
