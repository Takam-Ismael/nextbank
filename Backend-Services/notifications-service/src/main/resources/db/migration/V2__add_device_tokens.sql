-- device_tokens table for FCM push notifications
CREATE TABLE device_tokens (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT          NOT NULL,
    device_token    VARCHAR(500)    NOT NULL UNIQUE,
    device_type     VARCHAR(20)     NOT NULL,   -- ANDROID | IOS
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_device_tokens_user ON device_tokens(user_id);
CREATE INDEX idx_device_tokens_active ON device_tokens(user_id, is_active) WHERE is_active = TRUE;
