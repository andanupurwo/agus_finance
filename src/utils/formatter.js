export const formatRupiah = (num) => new Intl.NumberFormat('id-ID').format(num);
export const parseRupiah = (str) => parseInt(str.replace(/\./g, '')) || 0;

export const isCurrentMonth = (dateString) => {
  const selectedDate = new Date(dateString);
  const today = new Date();
  return selectedDate.getFullYear() === today.getFullYear() && 
         selectedDate.getMonth() === today.getMonth();
};

export const getMonthRange = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return {
    min: firstDay.toISOString().split('T')[0],
    max: lastDay.toISOString().split('T')[0]
  };
};
