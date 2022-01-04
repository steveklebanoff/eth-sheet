export interface TransactionsResponse {
  data: TransactionResponseData;
  error: boolean;
  error_message: null;
  error_code: null;
}

export interface TransactionResponseData {
  address: string;
  updated_at: Date;
  next_update_at: Date;
  quote_currency: string;
  chain_id: number;
  items: TransactionResponseItem[];
  pagination: TransactionResponsePagination;
}

export interface TransactionResponseItem {
  block_signed_at: Date;
  block_height: number;
  tx_hash: string;
  tx_offset: number;
  successful: boolean;
  from_address: string;
  from_address_label: null;
  to_address: string;
  to_address_label: null | string;
  value: string;
  value_quote: number;
  gas_offered: number;
  gas_spent: number;
  gas_price: number;
  gas_quote: number;
  gas_quote_rate: number;
  log_events: TransactionResponseLogEvent[];
}

export interface TransactionResponseLogEvent {
  block_signed_at: Date;
  block_height: number;
  tx_offset: number;
  log_offset: number;
  tx_hash: string;
  _raw_log_topics_bytes: null;
  raw_log_topics: string[];
  sender_contract_decimals: null;
  sender_name: null;
  sender_contract_ticker_symbol: null;
  sender_address: string;
  sender_address_label: null | string;
  sender_logo_url: null;
  raw_log_data: null | string;
  decoded: TransactionResponseDecoded | null;
}

export interface TransactionResponseDecoded {
  name: string;
  signature: string;
  params: TransactionResponseParam[] | null;
}

export interface TransactionResponseParam {
  name: string;
  type: TransactionResponseType;
  indexed: boolean;
  decoded: boolean;
  value: boolean | null | string;
}

export enum TransactionResponseType {
  Address = "address",
  Bool = "bool",
  Bytes = "bytes",
  Bytes32 = "bytes32",
  Uint112 = "uint112",
  Uint256 = "uint256",
  Uint32 = "uint32",
}

export interface TransactionResponsePagination {
  has_more: boolean;
  page_number: number;
  page_size: number;
  total_count: null;
}

export interface PricesResponse {
  data: PricingInfo[];
  error: boolean;
  error_message: null;
  error_code: null;
}

export interface PricingInfo {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  supports_erc: string[];
  logo_url: string;
  update_at: Date;
  quote_currency: string;
  prices: Price[];
}

export interface Price {
  contract_metadata: ContractMetadata;
  date: Date;
  price: number;
}

export interface ContractMetadata {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  supports_erc: string[];
  logo_url: string;
}

export interface CovalentBlockResponse {
  data: CovalentBlockData;
  error: boolean;
  error_message: null;
  error_code: null;
}

export interface CovalentBlockData {
  updated_at: Date;
  items: CovalentBlockItem[];
  pagination: null;
}

export interface CovalentBlockItem {
  signed_at: Date;
  height: number;
}
