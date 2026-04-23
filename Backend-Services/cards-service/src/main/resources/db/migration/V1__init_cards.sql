CREATE TABLE cards (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT          NOT NULL,
    account_id      BIGINT          NOT NULL,
    account_number  VARCHAR(20)     NOT NULL,
    card_number     VARCHAR(16)     NOT NULL UNIQUE,
    card_last_four  VARCHAR(4)      NOT NULL,
    card_type       VARCHAR(20)     NOT NULL,         -- VISA | MASTERCARD
    cvv_hash        VARCHAR(255)    NOT NULL,         -- BCrypt hash
    expiry_month    SMALLINT        NOT NULL,
    expiry_year     SMALLINT        NOT NULL,
    cardholder_name VARCHAR(100)    NOT NULL,
    status          VARCHAR(20)     NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cards_user    ON cards(user_id);
CREATE INDEX idx_cards_account ON cards(account_id);
