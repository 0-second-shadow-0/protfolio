# Om Prasad Nayak — Systems & Backend Engineering Portfolio

> **GitHub Profile**: [@doomsday-07](https://github.com/doomsday-07)  
> **Direct Contact**: [omprasadnayak7@gmail.com](mailto:omprasadnayak7@gmail.com)  
> **LinkedIn**: [linkedin.com/in/om-prasad-nayak-5b713a294](https://www.linkedin.com/in/om-prasad-nayak-5b713a294)

High-performance, bespoke systems engineering portfolio showcasing low-overhead telemetry daemons in **Rust**, lock-free concurrent storage engines in **Go**, and real-time predictive analytics pipelines in **Python**.

---

## ⚡ Core Engineering Systems

1. **[sysmon / resctl](https://github.com/doomsday-07/sysmon)** *(Rust)*  
   Cross-platform, low-overhead system monitoring CLI and live terminal dashboard. Directly streams kernel telemetry via `sysfs` and `procfs` with `< 5MB` RSS memory footprint and `< 0.05%` CPU utilization.

2. **[ultra-bDB & Redorb-Ranker](https://github.com/doomsday-07/Redorb-Ranker)** *(Go)*  
   Custom B-Tree storage engine featuring ACID transactions, node rebalancing, and atomic lock-free reads. Verified race-free via `go test -race` and profiled for 0-allocation hot paths using `runtime/pprof`.

3. **[respro2](https://github.com/doomsday-07/respro2)** *(Python)*  
   Real-time sales performance and inventory optimization platform with automated anomaly detection alerts and streaming analytics.

4. **[ecommerce-retention-analytics](https://github.com/doomsday-07/ecommerce-retention-analytics)** *(Python)*  
   Customer segmentation, cohort retention curves, and predictive lifetime value (LTV) analytics platform featuring an **86% recall** machine learning churn model.

5. **[ink-app](https://github.com/doomsday-07/ink-app)** *(Python)*  
   Low-latency digital inking application for macOS with Apple Vision OCR bridge and fine-tuned EasyOCR transformer pipeline (PyTorch + Accelerate).

6. **[Email Writer Assistant](https://email-writer-assistant-alpha.vercel.app)** *(Java & React)*  
   API-driven email drafting tool built with Spring Boot REST services, prompt chaining, and multilingual support.

---

## 🛠️ Architecture & Features

- **Interactive Telemetry Shell (`resctl v0.4.2`)**: An in-browser terminal emulator supporting interactive commands (`sysinfo`, `benchmarks`, `projects`, `skills`, `cat education`, `contact`, `clear`).
- **B-Tree Storage Engine Simulator**: Interactive visualizer showing B-Tree page splits and running simulated lock-free concurrency benchmarks.
- **Command Palette (`⌘K` / `Ctrl+K`)**: Rapid navigation and quick action execution.
- **Zero-Bloat Design**: Pure Vanilla HTML5, modern CSS3 custom properties design system, and Vanilla JavaScript with zero runtime frameworks.
- **Production Performance**: Fast loading, accessible semantics, responsive layouts, and clean typographic hierarchy.

---

## 🚀 Running Locally

```bash
# Clone the repository
git clone git@github.com:0-second-shadow-0/protfolio.git
cd protfolio

# Run with any local HTTP server
python3 -m http.server 8080
```
Open `http://localhost:8080` in your browser.
