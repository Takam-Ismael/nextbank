-- notifications table
CREATE TABLE notifications (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT          NOT NULL,
    type            VARCHAR(30)     NOT NULL,
    title           VARCHAR(100)    NOT NULL,
    message         VARCHAR(500)    NOT NULL,
    is_read         BOOLEAN         NOT NULL DEFAULT FALSE,
    reference_id    BIGINT,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notif_user   ON notifications(user_id);
CREATE INDEX idx_notif_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
