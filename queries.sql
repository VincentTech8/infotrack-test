-- Query A: Count certificates per matter in last 30 days
SELECT 
    o.matter_id,
    COUNT(c.id) AS certificates_count
FROM Orders o
JOIN Certificates c ON c.order_id = o.id
WHERE c.created_at >= CURRENT_DATE - INTERVAL '30 DAY'
GROUP BY o.matter_id;

-- Query B: Matter IDs without a Title certificate in last 30 days
SELECT m.id AS matter_id
FROM Matters m
LEFT JOIN Orders o ON o.matter_id = m.id
LEFT JOIN Certificates c 
       ON c.order_id = o.id 
       AND c.type = 'Title' 
       AND c.created_at >= CURRENT_DATE - INTERVAL '30 DAY'
WHERE c.id IS NULL;

-- Suggested index to speed up Query B
CREATE INDEX idx_certificates_type_created ON Certificates(type, created_at, order_id);
-- Justification:
-- Query B filters the Certificates table by type = 'Title' and created_at within the last 30 days,
-- then joins to Orders using order_id. This composite index allows the database to quickly:
-- 1. Filter by type and created_at without scanning the entire table.
-- 2. Efficiently join on order_id.
-- Including these three columns in the index minimizes table scans and improves query performance.
