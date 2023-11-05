import { EnvelopeSimple, Sword } from "@phosphor-icons/react";

export default function FriendCard() {
  return (
    <div className="bg-black42-200 flex justify-between rounded-lg items-center p-3 my-1">
      <div className="flex space-x-2 items-center">Maria</div>
      <div className="flex space-x-5 items-center">
        <EnvelopeSimple className="text-purple42-200" size={18} />
        <Sword className="text-purple42-200" size={18} />
      </div>
    </div>
  );
}
