import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Scissors } from "lucide-react";

import type { Service } from "@/lib/type/services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ServicesCard = ({ service }: { service: Service }) => {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-colors hover:border-primary/40">
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {service.image ? (
          <Image
            src={service.image}
            alt={service.serviceName}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Scissors className="size-8" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="leading-snug font-semibold">{service.serviceName}</h3>
          <Badge variant="secondary" className="shrink-0">
            {service.category}
          </Badge>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {service.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-bold text-primary">
              ${Number(service.price).toFixed(2)}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              {service.duration} min
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            render={<Link href={`/services/${service._id}`} />}
          >
            View Details
            <ArrowRight />
          </Button>
        </div>
      </div>
    </article>
  );
};

export default ServicesCard;
