export function formatDate(timestamp: number) {
  const date = new Date(timestamp * 1000); // Assuming the timestamp is in seconds
  const now = new Date();

  // @ts-ignore
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);

  let timeAgo;

  if (diffInSeconds < 60) {
    timeAgo = `${diffInSeconds} seconds ago`;
  }
  else if (diffInMinutes < 60) {
    timeAgo = `${diffInMinutes} minutes ago`;
  }
  else if (diffInHours < 24) {
    timeAgo = `${diffInHours} hours ago`;
  }
  else {
    // You can extend this to days, months, etc. if needed
    timeAgo = `${Math.floor(diffInHours / 24)} days ago`;
  }

  const formattedDate = date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short'
  });

  return `${timeAgo} (${formattedDate})`;
}
