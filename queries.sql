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
-- The query filters Certificates by type and created_at and joins by order_id.
