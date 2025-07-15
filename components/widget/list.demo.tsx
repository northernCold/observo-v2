"use client";

import { useProcessedListData } from "./processed-widget-wrapper";
import { List } from "./list";
import { WidgetState } from "@/components/ui/widget-state";
import { ResizableContainer } from "./resizable-container";

export function ListBasicDemo() {
  const {
    data: items,
    loading,
    error,
    refresh,
  } = useProcessedListData("https://jsonplaceholder.typicode.com/posts", {
    autoRefresh: true,
    refreshInterval: 15,
  });

  return (
    <div className=" border rounded-lg">
      <WidgetState
        loading={loading}
        error={error}
        empty={!loading && !error && items.length === 0}
        onRetry={refresh}
      >
        <List title="示例列表" items={items} />
      </WidgetState>
    </div>
  );
}

export function ListResizableDemo() {
  const {
    data: items,
    loading,
    error,
    refresh,
  } = useProcessedListData("https://jsonplaceholder.typicode.com/posts", {
    autoRefresh: true,
    refreshInterval: 15,
  });

  return (
    <ResizableContainer
      background="primary"
      shadow="soft"
      padding="comfortable"
    >
      <WidgetState
        loading={loading}
        error={error}
        empty={!loading && !error && items.length === 0}
        onRetry={refresh}
      >
        <List title="示例列表" items={items} />
      </WidgetState>
    </ResizableContainer>
  );
}
