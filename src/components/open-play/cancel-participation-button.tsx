import { cancelOpenPlayAction } from "@/actions/open-play";
import { Button } from "@/components/ui/button";

export function CancelParticipationButton({ id }: { id: string }) {
  return (
    <form action={cancelOpenPlayAction}>
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="outline">Cancel Participation</Button>
    </form>
  );
}
