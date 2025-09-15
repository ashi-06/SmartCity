import Link from "next/link";

export interface ServiceCardProps {
  category: string;
  id: string;
  slug: string;
  name: string;
  address?: string;
  rating?: number;
  estimatedPrice?: number;
  location?: { latitude: number; longitude: number };
}

export default function ServiceCard(props: ServiceCardProps) {
  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-medium">{props.name}</div>
          {props.address && <div className="text-sm opacity-70">{props.address}</div>}
        </div>
        {typeof props.rating === "number" && (
          <span className="text-sm bg-green-600 text-white px-2 py-0.5 rounded-md">{props.rating.toFixed(1)}</span>
        )}
      </div>

      <div className="flex items-center justify-between mt-1">
        {typeof props.estimatedPrice === "number" ? (
          <div className="text-sm">
            <span className="opacity-70">From</span>{" "}
            <span className="font-medium">₹{props.estimatedPrice}</span>
          </div>
        ) : (
          <div className="text-sm opacity-70">Price info unavailable</div>
        )}

        <div className="flex gap-2">
          <Link
            className="text-sm rounded-md border px-2 py-1 hover:bg-black/[.03] dark:hover:bg-white/[.06]"
            href={`/${props.category}/${encodeURIComponent(props.slug)}`}
          >
            View details
          </Link>
          {props.location && (
            <a
              className="text-sm rounded-md border px-2 py-1 hover:bg-black/[.03] dark:hover:bg-white/[.06]"
              href={`https://www.google.com/maps/dir/?api=1&destination=${props.location.latitude},${props.location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get directions
            </a>
          )}
        </div>
      </div>
    </div>
  );
}


