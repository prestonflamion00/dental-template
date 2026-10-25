/**
 * Every site the monitor checks. Add each client site here when it launches.
 *   url     page to load
 *   expect  text that must appear on the page (catches blank or wrong pages, not just outages)
 *   form    also check the contact form endpoint answers (practice sites with a live form)
 */
export interface Site {
  name: string;
  url: string;
  expect: string;
  form?: boolean;
}

export const SITES: Site[] = [
  { name: "Maple Grove (practice run)", url: "https://maplegrove-demo.com/", expect: "Maple Grove" },
  { name: "Demos: public examples", url: "https://demos.butterbite.workers.dev/", expect: "Website examples" },
  { name: "Demos: private hub", url: "https://demos.butterbite.workers.dev/hub-77aa44n8g2/", expect: "All practice demos" },
];
