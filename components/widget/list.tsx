import type { ListItem } from "@/lib/widget-data-service";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const listVariants = cva(
  "h-full w-full overflow-auto scrollbar-hide space-y-1",
  {
    variants: {
      listType: {
        disc: "list-disc pl-4",
        circle: "list-[circle] pl-4", 
        square: "list-[square] pl-4",
        decimal: "list-decimal pl-4",
        "lower-alpha": "list-[lower-alpha] pl-4",
        "upper-alpha": "list-[upper-alpha] pl-4",
        "lower-roman": "list-[lower-roman] pl-4",
        "upper-roman": "list-[upper-roman] pl-4",
        none: "",
      },
    },
    defaultVariants: {
      listType: "disc",
    },
  }
);

interface ListProps extends VariantProps<typeof listVariants> {
  title: string;
  items: ListItem[];
}

function List(props: ListProps) {
  const { title = "List", items, listType = 'disc' } = props;

  return (
    <div className="h-full w-full p-2">
      <div className="h-full w-full">
        <ul className={cn(listVariants({ listType }))}>
          {items.length > 0 ? (
            items.map((item) => (
              <li 
                key={item.id} 
                className="text-xs leading-relaxed"
              >
                {item.link ? (
                  <a
                    className="block hover:text-blue-600 transition-colors"
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={item.content}
                  >
                    <div className="truncate font-medium">{item.title}</div>
                    {item.content && (
                      <div className="text-gray-500 mt-1 line-clamp-2 text-xs leading-relaxed">
                        {item.content}
                      </div>
                    )}
                  </a>
                ) : (
                  <div>
                    <div className="truncate font-medium">{item.title}</div>
                    {item.content && (
                      <div className="text-gray-500 mt-1 line-clamp-2 text-xs leading-relaxed">
                        {item.content}
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))
          ) : (
            <li className="text-xs text-gray-500">暂无列表内容</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export { List };
