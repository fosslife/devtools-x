// import { trackEvent } from "@aptabase/tauri";

function trackEvent(event: string, data: any) {
  console.log("trackEvent", event, data);
}

function trackPageView(page: string) {
  trackEvent("page_view", { page });
}

function trackButtonClick(data: Record<string, any>) {
  trackEvent("button_click", { ...data });
}

function trackError(error: string) {
  trackEvent("error", { error });
}

function trackOtherEvent(event: string, data: any) {
  trackEvent(event, data);
}

export { trackPageView, trackButtonClick, trackError, trackOtherEvent };
