export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface Vendor {
  id: string;
  name: string;
  location: string;
  prepTime: string;
  fullyBooked: boolean;
  menuItems: MenuItem[];
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  vendor: Vendor;
  items: OrderItem[];
  pickupTime: string;
  total: number;
  status: "Pending" | "Ready" | "Picked Up" | "Completed";
  createdAt: Date;
}

export const vendors: Vendor[] = [
  {
    id: "1",
    name: "Campus Grill",
    location: "Student Union, Ground Floor",
    prepTime: "15-20 min",
    fullyBooked: false,
    menuItems: [
      {
        id: "1-1",
        name: "Classic Burger",
        description: "Beef patty with lettuce, tomato, and special sauce",
        price: 8.99,
      },
      {
        id: "1-2",
        name: "Chicken Sandwich",
        description: "Grilled chicken breast with avocado and cheese",
        price: 9.49,
      },
      {
        id: "1-3",
        name: "Veggie Wrap",
        description: "Fresh vegetables with hummus in a wheat wrap",
        price: 7.99,
      },
      {
        id: "1-4",
        name: "Fries",
        description: "Crispy golden french fries",
        price: 3.49,
      },
      {
        id: "1-5",
        name: "Onion Rings",
        description: "Beer-battered onion rings",
        price: 4.49,
      },
    ],
  },
  {
    id: "2",
    name: "Noodle House",
    location: "Science Building, Level 2",
    prepTime: "10-15 min",
    fullyBooked: false,
    menuItems: [
      {
        id: "2-1",
        name: "Beef Ramen",
        description: "Rich broth with sliced beef and soft-boiled egg",
        price: 11.99,
      },
      {
        id: "2-2",
        name: "Vegetable Pho",
        description: "Vietnamese noodle soup with fresh vegetables",
        price: 9.99,
      },
      {
        id: "2-3",
        name: "Pad Thai",
        description: "Stir-fried rice noodles with shrimp and peanuts",
        price: 10.99,
      },
      {
        id: "2-4",
        name: "Spring Rolls",
        description: "Crispy rolls with vegetable filling (3 pcs)",
        price: 4.99,
      },
    ],
  },
  {
    id: "3",
    name: "Quick Bites Cafe",
    location: "Library Building, Lobby",
    prepTime: "5-10 min",
    fullyBooked: true,
    menuItems: [
      {
        id: "3-1",
        name: "Turkey Club",
        description: "Triple-decker sandwich with turkey and bacon",
        price: 8.49,
      },
      {
        id: "3-2",
        name: "Caesar Salad",
        description: "Romaine lettuce with parmesan and croutons",
        price: 7.99,
      },
      {
        id: "3-3",
        name: "Soup of the Day",
        description: "Ask staff for today's selection",
        price: 4.99,
      },
      {
        id: "3-4",
        name: "Coffee",
        description: "Freshly brewed coffee",
        price: 2.99,
      },
    ],
  },
];

export function generateOrderNumber(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const letter = letters[Math.floor(Math.random() * letters.length)];
  const number = Math.floor(1000 + Math.random() * 9000);
  return `#${letter}${number}`;
}

export function generateTimeSlots(): string[] {
  const slots: string[] = [];
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  for (let hour = 11; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour > currentHour || (hour === currentHour && minute > currentMinute + 15)) {
        const startTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const endMinute = minute + 30;
        const endHour = endMinute >= 60 ? hour + 1 : hour;
        const endTime = `${endHour.toString().padStart(2, "0")}:${(endMinute % 60).toString().padStart(2, "0")}`;
        slots.push(`${formatTime(hour, minute)} - ${formatTime(endHour, endMinute % 60)}`);
      }
    }
  }

  return slots.slice(0, 8);
}

function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
}
