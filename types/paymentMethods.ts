export interface CardData {
  paymentMethod: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  cardHolderName: string;
}

export const validCard: CardData = {
  paymentMethod: "Credit Card",
  cardNumber: "4444-4444-4444-4444",
  expirationDate: "12/2028",
  cvv: "123",
  cardHolderName: "TEST USER",
};

export interface bankTransferData {
  paymentMethod: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export const validBankTransfer: bankTransferData = {
  paymentMethod: "Bank Transfer",
  bankName: "Fake bank",
  accountName: "Fake bank account name",
  accountNumber: "12345678",
};
