"use client";
import { useState, useRef, useEffect, useCallback } from "react";

const DEFAULT_PRODUCT = `## DỮ LIỆU SẢN PHẨM

### Thông tin dự án
- Tên: ABC Riverside
- Chủ đầu tư: Tập đoàn ABC
- Vị trí: Đường Nguyễn Hữu Cảnh, TP Thủ Đức, TP.HCM
- Loại hình: Chung cư cao cấp
- Pháp lý: Sổ hồng riêng, đã có GPXD + phê duyệt 1/500 + bảo lãnh NH VCB
- Trạng thái: Đang xây dựng (đã xong tầng 18/25)
- Tổng số căn: 500 | 25 tầng
- Bàn giao: Q4/2026

### Bảng giá (hiệu lực 01/04/2026)
| Loại | Diện tích | Giá từ | Giá/m² |
| 1PN Layout A | 45.5m² | 2.1 - 2.5 tỷ | 46 triệu/m² |
| 2PN Layout B | 68.5m² | 3.2 - 3.8 tỷ | 51 triệu/m² |
| 3PN Layout C | 95m² | 4.5 - 5.2 tỷ | 52 triệu/m² |

### Bảng hàng còn bán
| Căn | Block | Tầng | Loại | Hướng | View | Giá | Ghi chú |
| A-0805 | A | 8 | 1PN-A | ĐN | Nội khu | 2.2 tỷ | Giá tốt nhất |
| A-1205 | A | 12 | 2PN-B | ĐN | Hồ bơi | 3.3 tỷ | |
| A-1508 | A | 15 | 2PN-B | ĐN | Sông SG | 3.5 tỷ | Căn góc, đẹp nhất |
| A-2001 | A | 20 | 3PN-C | ĐN | Sông SG+TP | 5.0 tỷ | View panorama |
| B-1003 | B | 10 | 1PN-A | TB | Nội khu | 2.15 tỷ | |
| B-1203 | B | 12 | 2PN-B | ĐN | Nội khu | 3.2 tỷ | Giá tốt |
| B-1505 | B | 15 | 2PN-B | TN | Công viên | 3.35 tỷ | |
| B-1801 | B | 18 | 3PN-C | ĐN | Sông SG | 4.8 tỷ | |

### Chính sách (đến 30/06/2026)
- Chiết khấu thanh toán sớm 70%: giảm 5%
- Chiết khấu thanh toán sớm 95%: giảm 8%
- Quà tặng: Gói nội thất 200 triệu (còn 35 suất)
- Ngân hàng: VCB ưu đãi 7%/24 tháng, vay max 70% | TCB ưu đãi 6.5%/12 tháng, vay max 80%
- Hỗ trợ lãi suất 0% trong 24 tháng qua VCB

### Tiến độ thanh toán chuẩn
- Đặt cọc: 50 triệu
- Ký HĐMB (30 ngày sau cọc): 20%
- Đợt 2: 10% (Q3/2026) | Đợt 3: 10% (Q4/2026) | Đợt 4: 10% (Q1/2027)
- Nhận nhà: 25% (Q4/2027) | Sổ hồng: 5%

### Tiện ích
- Nội khu: Hồ bơi vô cực 50m tầng 5, sky lounge tầng 25, gym, sauna, BBQ, co-working, trường mầm non, TTTM tầng 1-3
- Ngoại khu: Trường QT BIS (500m), BV Quốc tế City (1.5km), Metro tuyến 1 Ga Thảo Điền (200m), Xa lộ Hà Nội (500m)

### USP
1. Dự án duy nhất 3 mặt tiền view sông Sài Gòn
2. Kết nối trực tiếp Metro tuyến 1 (200m)
3. Hồ bơi vô cực dài nhất khu Đông (50m)`;

const WELCOME = "Chào anh/chị! 👋\n\nEm là trợ lý tư vấn bất động sản AI, được đào tạo bởi chuyên gia BĐS 20 năm kinh nghiệm. Em có thể giúp anh/chị tìm hiểu về dự án, phân tích đầu tư, và tư vấn sản phẩm phù hợp nhất.\n\nAnh/chị đang quan tâm đến bất động sản để ở hay đầu tư ạ?";

export default function Home() {
  const [messages, setMessages] = useState([{ role: "assistant", content: WELCOME }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [productData, setProductData] = useState(DEFAULT_PRODUCT);
  const [savedProduct, setSavedProduct] = useState(DEFAULT_PRODUCT);
  const [adminPass, setAdminPass] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [error, setError] = useState("");
  const msgsEnd = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    msgsEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setError("");
    const newMsgs = [...messages, { role: "user", content: text }];
    setMessages(newMsgs);
    setLoading(true);

    try {
      const history = newMsgs
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          productData: savedProduct,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Xin lỗi, em gặp sự cố kỹ thuật. Anh/chị thử lại nhé ạ." },
        ]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Kết nối bị gián đoạn. Anh/chị thử lại nhé ạ." },
      ]);
    }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [input, loading, messages, savedProduct]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const saveProduct = () => {
    setSavedProduct(productData);
    setMessages([{ role: "assistant", content: WELCOME }]);
    setShowAdmin(false);
    setAdminUnlocked(false);
  };

  const quickQ = (q) => {
    setInput(q);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const ADMIN_PW = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "linear-gradient(135deg, #0a1628 0%, #1a2744 50%, #0f1d32 100%)" }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", flexShrink: 0 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #d4a574 0%, #c4956a 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#1a2744", flexShrink: 0 }}>R</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#f0ede8" }}>RE Sales Bot</div>
          <div style={{ fontSize: 11, color: "#8b9bb5", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }}></span>
            Chuyên gia tư vấn BĐS AI
          </div>
        </div>
        <button onClick={() => setShowAdmin(!showAdmin)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(212,165,116,0.3)", background: "rgba(212,165,116,0.08)", color: "#d4a574", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>
          {showAdmin ? "Đóng" : "Admin"}
        </button>
      </div>

      {/* Admin Panel */}
      {showAdmin && (
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(212,165,116,0.03)", flexShrink: 0 }}>
          {!adminUnlocked ? (
            <div style={{ padding: 16, display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#8b9bb5", flexShrink: 0 }}>Mật khẩu:</span>
              <input type="password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} placeholder="Nhập mật khẩu admin..." style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#f0ede8", fontSize: 13, outline: "none" }} onKeyDown={(e) => { if (e.key === "Enter" && adminPass === ADMIN_PW) setAdminUnlocked(true); }} />
              <button onClick={() => { if (adminPass === ADMIN_PW) setAdminUnlocked(true); else alert("Sai mật khẩu!"); }} style={{ padding: "8px 16px", borderRadius: 8, background: "#d4a574", color: "#1a2744", fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" }}>Mở</button>
            </div>
          ) : (
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#d4a574", marginBottom: 8 }}>Dữ liệu sản phẩm</div>
              <p style={{ fontSize: 12, color: "#8b9bb5", marginBottom: 10, lineHeight: 1.6 }}>Thay dữ liệu bên dưới bằng thông tin dự án thật. Bot CHỈ tư vấn dựa trên data này.</p>
              <textarea value={productData} onChange={(e) => setProductData(e.target.value)} style={{ width: "100%", minHeight: 250, padding: 12, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "#c8d0de", fontSize: 12, fontFamily: "monospace", lineHeight: 1.6, resize: "vertical", outline: "none" }} />
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button onClick={saveProduct} style={{ flex: 1, padding: 10, borderRadius: 8, background: "#d4a574", color: "#1a2744", fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" }}>Lưu & Reset chat</button>
                <button onClick={() => setProductData(DEFAULT_PRODUCT)} style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#8b9bb5", fontSize: 13, cursor: "pointer" }}>Demo mẫu</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div style={{ padding: "8px 16px", background: "rgba(239,68,68,0.1)", borderBottom: "1px solid rgba(239,68,68,0.2)", fontSize: 12, color: "#f87171" }}>
          Lỗi: {error}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflow: "auto", padding: "16px 12px" }}>
        {messages.map((m, i) => (
          <div key={i} className="msg-appear" style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
            {m.role === "assistant" && (
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #d4a574, #c4956a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#1a2744", marginRight: 8, flexShrink: 0, marginTop: 2 }}>R</div>
            )}
            <div style={{ maxWidth: "82%", padding: "10px 14px", borderRadius: m.role === "user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px", background: m.role === "user" ? "linear-gradient(135deg, #2a5298, #1e3a6e)" : "rgba(255,255,255,0.05)", border: m.role === "user" ? "none" : "1px solid rgba(255,255,255,0.06)", fontSize: 14, lineHeight: 1.7, color: m.role === "user" ? "#e8e6e1" : "#c8d0de", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="msg-appear" style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #d4a574, #c4956a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#1a2744" }}>R</div>
            <div style={{ padding: "12px 16px", borderRadius: "4px 14px 14px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", gap: 5 }}>
                {[0, 1, 2].map((j) => (
                  <div key={j} style={{ width: 7, height: 7, borderRadius: "50%", background: "#d4a574", animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${j * 0.2}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={msgsEnd} />
      </div>

      {/* Quick questions */}
      {messages.length <= 1 && (
        <div style={{ padding: "0 12px 8px", display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[
            "Tôi muốn mua căn hộ 2PN cho gia đình",
            "Tôi quan tâm đầu tư BĐS",
            "Cho tôi xem bảng giá",
            "So sánh các căn còn bán",
          ].map((q, i) => (
            <button key={i} className="quick-btn" onClick={() => quickQ(q)} style={{ padding: "7px 12px", borderRadius: 20, border: "1px solid rgba(212,165,116,0.2)", background: "rgba(212,165,116,0.06)", color: "#d4a574", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}>
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "8px 12px 12px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey} placeholder="Nhập câu hỏi của anh/chị..." rows={1} style={{ flex: 1, padding: "10px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#f0ede8", fontSize: 14, outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.5, maxHeight: 120 }} onInput={(e) => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }} />
          <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ width: 44, height: 44, borderRadius: 12, background: input.trim() ? "linear-gradient(135deg, #d4a574, #c4956a)" : "rgba(255,255,255,0.06)", border: "none", cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={input.trim() ? "#1a2744" : "#4a5568"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 8, fontSize: 10, color: "#4a5568" }}>
          AI tư vấn BĐS — Thông tin tham khảo, vui lòng xác nhận với sale trước khi quyết định
        </div>
      </div>
    </div>
  );
}
