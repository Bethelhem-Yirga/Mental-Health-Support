const crypto = require('crypto');

// Generate a consistent color based on name
const getColorFromName = (name) => {
  const colors = [
    '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
    '#14B8A6', '#D946EF', '#F43F5E', '#0EA5E9', '#EAB308'
  ];
  const hash = crypto.createHash('md5').update(name).digest('hex');
  const index = parseInt(hash.substring(0, 8), 16) % colors.length;
  return colors[index];
};

// Generate initials from name
const getInitials = (name) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Generate UI Avatars URL
const getUIAvatarUrl = (name, size = 128) => {
  const initials = getInitials(name);
  const backgroundColor = getColorFromName(name).substring(1);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${backgroundColor}&color=fff&size=${size}&rounded=true&bold=true`;
};

// Generate DiceBear Avatars URL (more variety)
const getDiceBearUrl = (name, size = 128) => {
  const seed = name.toLowerCase().replace(/\s/g, '');
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4&size=${size}`;
};

// Generate random placeholder image (for testing)
const getPlaceholderImage = (id) => {
  return `https://picsum.photos/id/${(id % 100) + 1}/200/200`;
};

module.exports = {
  getColorFromName,
  getInitials,
  getUIAvatarUrl,
  getDiceBearUrl,
  getPlaceholderImage
};
