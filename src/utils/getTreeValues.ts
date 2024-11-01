export const getTreeValues = (data: any[], key: string) => {
  const items: any[] = [];
  const keys: string[] = [];

  data.forEach((item) => {
    if (item[`${key}`] && !keys.includes(item[`${key}`])) {
      keys.push(item[`${key}`]);
    }
  });
  data.forEach((item) => {
    if (item[`${key}`]) {
      const index = items.findIndex((i) => i.value === item[`${key}`]);
      const children = data.filter(
        (i) => i[`${key}`] && i[`${key}`] === item[`${key}`]
      );
      if (index !== -1) {
        items[index].children = children.map((i) => ({
          title: i.title,
          value: i._id,
        }));
      }
    } else {
      items.push({
        title: item.title,
        value: item._id,
      });
    }
  });

  return items;
};
