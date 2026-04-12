/**
 * VeriAI Systems — Navigation & Component System
 *
 * Handles: component loading, auth, theme, i18n, mobile menu.
 * Requires a local HTTP server for fetch() to work (file:// protocol blocks cross-origin fetches).
 */
(function () {
  'use strict';

  // ── PATH RESOLUTION ───────────────────────────────────────────────────────────
  // Calculates root-relative path prefix based on current page depth.
  // /pages/index.html       → depth 1 → ../
  // /products/eng/x.html   → depth 2 → ../../
  function getRoot() {
    var parts = window.location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
    var depth = parts.length - 1; // minus the filename itself
    return depth > 0 ? '../'.repeat(depth) : './';
  }

  var ROOT = getRoot();

  // ── COMPONENT / SECTION LOADER ────────────────────────────────────────────────
  function loadHTML(selector, url) {
    var el = document.querySelector(selector);
    if (!el) return Promise.resolve();
    return fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .then(function (html) {
        el.innerHTML = html;
      })
      .catch(function (e) {
        console.warn('[VeriAI] Failed to load:', url, e.message);
      });
  }

  // ── AUTH ──────────────────────────────────────────────────────────────────────
  function requireAuth() {
    if (localStorage.getItem('auth') !== 'ok') {
      window.location.replace(ROOT + 'index.html');
    }
  }

  function signOut() {
    localStorage.removeItem('auth');
    window.location.replace(ROOT + 'index.html');
  }

  // ── THEME ─────────────────────────────────────────────────────────────────────
  function initTheme() {
    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  }

  function toggleTheme() {
    var isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  // ── I18N ──────────────────────────────────────────────────────────────────────
  var translations = {
    en: {
      // Nav
      'nav-platform': 'Platform',
      'nav-products': 'Products',
      // Hero
      'hero-tag': 'DETERMINISTIC VALIDATION ACTIVE',
      'hero-title': 'Executable Validation Platform for Safety-Critical Embedded Systems',
      'hero-subtitle': 'Transform requirements into deterministic validation. From structured DSL to real-world signal behavior. Fully local.',
      'hero-signal': 'Natural language \u2192 Structured DSL \u2192 Deterministic Validation',
      'hero-detail': 'Processed locally \u00b7 No cloud \u00b7 No black-box inference',
      'hero-tagline': 'From requirement to verification \u2014 without ambiguity.',
      'cta-platform': 'Explore Platform',
      'cta-products': 'View Products',
      // Platform overview
      'overview-tag': 'Architecture',
      'overview-heading': 'Three-layer validation infrastructure.',
      'overview-dsl-title': 'DSL Interface',
      'overview-dsl-desc': 'Requirements become executable rules through controlled transformation logic.',
      'overview-engine-title': 'Validation Engine',
      'overview-engine-desc': 'Deterministic rule evaluation. Same input \u2014 same output. Every time.',
      'overview-signals-title': 'Signal Domain',
      'overview-signals-desc': 'CAN, CSV, UART \u2014 real system behavior is the ground truth.',
      // Products — engineering domain
      'eng-domain-tag': 'Engineering Validation',
      'eng-domain-heading': 'Signal-based validation tools for embedded systems engineers.',
      'prod-realtime-title': 'Real-Time Signal Validation',
      'prod-realtime-desc': 'Validate live CAN and UART signals against DSL rules in real time.',
      'prod-sim-title': 'Simulation Validation',
      'prod-sim-desc': 'Software-in-the-loop behavioral validation against DSL-defined specifications.',
      'prod-hil-title': 'HIL Testing',
      'prod-hil-desc': 'Hardware-in-the-loop closed-loop ECU testing with deterministic rule evaluation.',
      'prod-log-title': 'Log Replay \u0026 Analysis',
      'prod-log-desc': 'Replay CAN candump, CSV timelines, and UART logs against rule sets.',
      // Products — compliance domain
      'cmp-domain-tag': 'Compliance Tools',
      'cmp-domain-heading': 'Structured test execution for regulated environments.',
      'prod-tse-title': 'TSE \u2014 Test Suite Execution',
      'prod-tse-desc': 'Structured compliance test execution with full traceability to requirements. Audit-ready output for regulated industries.',
      // Footer
      'footer-tagline': 'Executable Validation Platform',
      'footer-status': 'Prototype \u00b7 Active Development',
      'footer-navigation': 'Navigation',
      'nav-language': 'Language',
      'footer-legal': 'Legal',
      'footer-impressum': 'Impressum',
      'footer-privacy': 'Privacy Policy',
      'footer-legal-hint': 'This website presents a prototype engineering system under active development.',
      // Platform page
      'plt-tag': 'Platform',
      'plt-title': 'Engineering-grade validation infrastructure.',
      'plt-sub': 'Deterministic. Local. Traceable. From natural language requirement to executable validation \u2014 without black-box processing.',
      'plt-how-tag': 'How it works',
      'plt-how-title': 'Three steps from requirement to verdict.',
      'plt-step1-num': '01', 'plt-step2-num': '02', 'plt-step3-num': '03',
      'plt-step1-title': 'Natural Language Requirements',
      'plt-step1-desc': 'Describe expected system behavior in plain language. No formal specification syntax required. English, German, or Chinese.',
      'plt-step2-title': 'Structured DSL Transformation',
      'plt-step2-desc': 'Requirements are parsed into deterministic DSL rules through controlled transformation logic. No ambiguity, no interpretation gaps, no black-box processing.',
      'plt-step3-title': 'Deterministic Validation',
      'plt-step3-desc': 'Rules execute against real-world signal data \u2014 CAN, CSV, UART. Every validation produces a traceable, reproducible result with full audit trail.',
      'plt-how-anchor': 'Designed for real-world signal validation environments (CAN, Ethernet, Analog)',
      'plt-cap-tag': 'Capabilities',
      'plt-cap-title': 'Core platform capabilities.',
      'plt-cap1-title': 'Deterministic Validation Engine',
      'plt-cap1-desc': 'Every rule evaluation produces the same result given the same input. No probabilistic behavior, no runtime variance. Suitable for safety-critical environments.',
      'plt-cap2-title': 'Signal-Based Rule Evaluation',
      'plt-cap2-desc': 'Validation rules operate directly on signal timelines \u2014 CAN, CSV, UART \u2014 not on code or test stubs. Real system behavior is the ground truth.',
      'plt-cap3-title': 'Local Execution',
      'plt-cap3-desc': 'The platform runs entirely on-premise. No cloud dependency, no data transmission, no external services required. Your signal data stays within your environment.',
      'plt-cap4-title': 'Reproducible Validation Workflows',
      'plt-cap4-desc': 'Baseline and optimized runs produce comparable, auditable results. Full trace for every pass/fail decision \u2014 from signal trigger to final verdict.',
      'plt-par-tag': 'Paradigm',
      'plt-par-title': 'The Validation Paradigm',
      'plt-par-sub': 'An integrated environment for translating requirements into verifiable system truth.',
      'plt-par1-title': 'DSL: The Unified Interface',
      'plt-par1-desc': 'Expressing complex system logic as verifiable rules. The bridge between human requirement and machine verification.',
      'plt-par2-title': 'Deterministic Engine',
      'plt-par2-desc': 'Eliminating uncertainty. Every requirement is validated against real-time signals with microsecond precision.',
      'plt-par3-title': 'Requirement Provenance',
      'plt-par3-desc': 'Direct traceability from signal-level validation back to high-level requirements. Every pass/fail has a behavioral root cause.',
      'plt-par4-title': 'Multi-source Replay',
      'plt-par4-desc': 'Replay CAN logs, CSV timelines, and UART traces through a unified adapter framework. One normalized frame format across all data sources.',
      'plt-par5-title': 'Validation Optimization',
      'plt-par5-desc': 'Metrics-driven selection engine decides which validations to re-execute. Targets 30\u201350% reduction in execution cost while retaining critical defect detection.',
      'plt-par6-title': 'Signal Quality Diagnostics',
      'plt-par6-desc': 'Distinguishes system failures from data-quality issues. UNKNOWN and WEAK verdicts prevent false failures caused by stale or missing signal data.',
      'plt-demo-tag': 'Demo',
      'plt-demo-title': 'Executable Requirement Demo',
      'plt-demo-sub': 'A high-level safety requirement validated against real-time cross-signal behavior.',
      'plt-flow1': 'Requirement', 'plt-flow2': 'DSL', 'plt-flow3': 'Validation', 'plt-flow4': 'Verdict',
      'plt-demo-btn': 'Verify Behavior',
      'plt-dsl-comment': '// "If speed > 30 and collision risk \u2192 brake within 150ms"',
      'plt-demo-evaluating': 'Engine: Evaluating Cross-Signal Dependencies...',
      'plt-demo-pass': 'Behavior Verified',
      'plt-demo-result': 'REQUIREMENT "Emergency_Response" MET.\nObserved reaction time 25ms < threshold 150ms.\nConfidence: STRONG \u00b7 Verdict: PASS',
      'plt-phil-tag': 'Engineering Philosophy',
      'plt-phil-title': 'Modern systems are defined by behavior, not code.',
      'plt-phil-left-tag': 'Traditional Testing',
      'plt-phil-left-desc': 'Validates specific implementations and unit-level functions. Often disconnected from high-level system requirements, leading to coverage gaps in complex interactions.',
      'plt-phil-right-tag': 'VeriAI Paradigm',
      'plt-phil-right-desc': 'Validates system-level behavior defined directly by requirements. The deterministic engine ensures the physical world behaves exactly as specified in the rule world.',
      'plt-phil-boundary': 'System Boundary: The system observes and validates signals, but does not control or intrude upon the environment itself.',
      'plt-faq-tag': 'FAQ',
      'plt-faq-title': 'Frequently Asked Questions',
      'plt-faq-q1': 'Do I need to write DSL manually?',
      'plt-faq-a1': 'No. VeriAI transforms natural language requirements into executable DSL automatically through controlled transformation logic.',
      'plt-faq-q2': 'How is this different from traditional testing?',
      'plt-faq-a2': 'Traditional testing validates implementations. VeriAI validates system behavior directly from requirements \u2014 against real-world signal conditions.',
      'plt-faq-q3': 'How does the DSL integrate with existing toolchains?',
      'plt-faq-a3': 'The DSL is an abstraction layer mappable to existing test environments, simulation frameworks, or real hardware interfaces. It adds a deterministic validation layer on top of your existing stack.',
      'plt-faq-q4': 'What signal types and interfaces are supported?',
      'plt-faq-a4': 'CAN, Ethernet, and analog signals. The platform validates cross-signal dependencies and temporal behavior across heterogeneous multi-signal environments.',
      'plt-faq-q5': 'Simulation or real hardware?',
      'plt-faq-a5': 'Both. Consistent validation logic regardless of execution environment \u2014 simulation models or real-world hardware signal inputs.',
      'plt-faq-q6': 'Does VeriAI control the system under test?',
      'plt-faq-a6': 'No. VeriAI strictly observes and evaluates signals. It does not control or interfere with the system or environment.',
      'plt-faq-q7': 'Does the platform rely on cloud-based AI?',
      'plt-faq-a7': 'No. All processing is local with controlled transformation logic. This ensures deterministic behavior, reproducibility, and suitability for safety-critical environments.',
      'plt-faq-q8': 'Does the platform support CAN logs and UART traces?',
      'plt-faq-a8': 'Yes. Replay adapters for CAN candump (with DBC decoding), CSV signal timelines, and UART logs. All normalized into a unified frame format.',
      'plt-faq-q9': 'How does the validation optimization loop work?',
      'plt-faq-a9': 'A full baseline run collects per-test metrics. A deterministic decision engine selects which validations need re-execution. Targets 30\u201350% execution cost reduction while retaining critical defect detection.',
      'plt-faq-q10': 'What stage is the platform currently in?',
      'plt-faq-a10': 'Early-stage development. Core DSL, validation engine, and signal adapters are being actively prototyped.',
      'plt-contact-tag': 'Contact',
      'plt-contact-title': 'Get in touch',
      'plt-contact-sub': 'Direct channels \u2014 no forms, no intermediaries.',
      'plt-contact-eng-label': 'Engineering inquiries',
      'plt-contact-eng-desc': 'Technical questions, validation system, DSL, integration.',
      'plt-contact-gen-label': 'General inquiries',
      'plt-contact-gen-desc': 'Partnerships, early access requests, general information.',
      // Products page header
      'products-tag': 'Products',
      'products-heading': 'Engineering Validation products.',
      'products-sub': 'Signal-based validation tools for embedded systems teams. Additional application domains are under evaluation for future releases.',
      // Future applications section
      'future-tag': 'Future Applications',
      'future-heading': 'The platform architecture is designed for extension.',
      'future-sub': 'Current focus: Engineering Validation \u00b7 Future domains: under evaluation',
      'future-1-title': 'Compliance Test Execution',
      'future-1-desc': 'Structured test suite execution with traceability to regulatory requirements. A potential extension for regulated industries \u2014 not a current product.',
      'future-2-title': 'Cross-Domain Requirement Linking',
      'future-2-desc': 'Traceability between system-level requirements, subsystem specs, and validation evidence across organizational boundaries.',
      'future-3-title': 'Validation Analytics',
      'future-3-desc': 'Aggregated metrics across validation runs, teams, and product lines. Long-term trend analysis on coverage, flakiness, and failure rates.',
      'future-note': 'The Engineering Validation suite is designed with a modular adapter architecture. Additional application domains can be introduced without restructuring the core validation engine or existing products.'
    },
    de: {
      'nav-platform': 'Plattform',
      'nav-products': 'Produkte',
      'hero-tag': 'DETERMINISTISCHE VALIDIERUNG AKTIV',
      'hero-title': 'Ausf\u00fchrbare Validierungsplattform f\u00fcr sicherheitskritische eingebettete Systeme',
      'hero-subtitle': 'Anforderungen in deterministische Validierung \u00fcbersetzen. Vom strukturierten DSL zum realen Signalverhalten. Vollst\u00e4ndig lokal.',
      'hero-signal': 'Nat\u00fcrliche Sprache \u2192 Strukturiertes DSL \u2192 Deterministische Validierung',
      'hero-detail': 'Lokal verarbeitet \u00b7 Kein Cloud \u00b7 Keine Black-Box-Inferenz',
      'hero-tagline': 'Von der Anforderung zur Verifikation \u2014 ohne Mehrdeutigkeit.',
      'cta-platform': 'Plattform erkunden',
      'cta-products': 'Produkte ansehen',
      'overview-tag': 'Architektur',
      'overview-heading': 'Dreischichtige Validierungsinfrastruktur.',
      'overview-dsl-title': 'DSL-Schnittstelle',
      'overview-dsl-desc': 'Anforderungen werden durch kontrollierte Transformationslogik zu ausf\u00fchrbaren Regeln.',
      'overview-engine-title': 'Validierungs-Engine',
      'overview-engine-desc': 'Deterministische Regelauswertung. Gleiche Eingabe \u2014 gleiche Ausgabe. Jederzeit.',
      'overview-signals-title': 'Signaldom\u00e4ne',
      'overview-signals-desc': 'CAN, CSV, UART \u2014 reales Systemverhalten ist die Grundlage.',
      'eng-domain-tag': 'Engineering-Validierung',
      'eng-domain-heading': 'Signalbasierte Validierungswerkzeuge f\u00fcr Embedded-Systems-Ingenieure.',
      'prod-realtime-title': 'Echtzeit-Signalvalidierung',
      'prod-realtime-desc': 'Validierung von Live-CAN- und UART-Signalen gegen DSL-Regeln in Echtzeit.',
      'prod-sim-title': 'Simulationsvalidierung',
      'prod-sim-desc': 'Software-in-the-Loop-Verhaltensvalidierung gegen DSL-Spezifikationen.',
      'prod-hil-title': 'HIL-Tests',
      'prod-hil-desc': 'Hardware-in-the-Loop-ECU-Tests mit deterministischer Regelauswertung.',
      'prod-log-title': 'Log-Replay & Analyse',
      'prod-log-desc': 'Replay von CAN-Logs, CSV-Zeitreihen und UART-Protokollen gegen Regelwerke.',
      'cmp-domain-tag': 'Compliance-Tools',
      'cmp-domain-heading': 'Strukturierte Testausf\u00fchrung f\u00fcr regulierte Umgebungen.',
      'prod-tse-title': 'TSE \u2014 Testsuite-Ausf\u00fchrung',
      'prod-tse-desc': 'Strukturierte Compliance-Testausf\u00fchrung mit vollst\u00e4ndiger R\u00fcckverfolgbarkeit zu Anforderungen.',
      'footer-tagline': 'Ausf\u00fchrbare Validierungsplattform',
      'footer-status': 'Prototyp \u00b7 Aktive Entwicklung',
      'footer-navigation': 'Navigation',
      'nav-language': 'Sprache',
      'footer-legal': 'Rechtliches',
      'footer-impressum': 'Impressum',
      'footer-privacy': 'Datenschutzerkl\u00e4rung',
      'footer-legal-hint': 'Diese Website stellt ein Prototyp-Engineering-System in aktiver Entwicklung dar.',
      // Platform page — DE
      'plt-tag': 'Plattform',
      'plt-title': 'Validierungsinfrastruktur auf Engineering-Niveau.',
      'plt-sub': 'Deterministisch. Lokal. Nachverfolgbar. Von der nat\u00fcrlichen Sprache zur ausf\u00fchrbaren Validierung \u2014 ohne Black-Box-Verarbeitung.',
      'plt-how-tag': 'So funktioniert es',
      'plt-how-title': 'Drei Schritte von der Anforderung zum Ergebnis.',
      'plt-step1-num': '01', 'plt-step2-num': '02', 'plt-step3-num': '03',
      'plt-step1-title': 'Anforderungen in nat\u00fcrlicher Sprache',
      'plt-step1-desc': 'Beschreiben Sie das erwartete Systemverhalten in einfacher Sprache. Keine formale Spezifikationssyntax erforderlich. Englisch, Deutsch oder Chinesisch.',
      'plt-step2-title': 'Strukturierte DSL-Transformation',
      'plt-step2-desc': 'Anforderungen werden durch kontrollierte Transformationslogik in deterministische DSL-Regeln geparst. Keine Mehrdeutigkeit, keine Interpretationsl\u00fccken.',
      'plt-step3-title': 'Deterministische Validierung',
      'plt-step3-desc': 'Regeln werden gegen reale Signaldaten ausgef\u00fchrt \u2014 CAN, CSV, UART. Jede Validierung liefert ein nachverfolgbares, reproduzierbares Ergebnis mit vollst\u00e4ndigem Pr\u00fcfpfad.',
      'plt-how-anchor': 'Entwickelt f\u00fcr reale Signalvalidierungsumgebungen (CAN, Ethernet, Analog)',
      'plt-cap-tag': 'F\u00e4higkeiten',
      'plt-cap-title': 'Kernf\u00e4higkeiten der Plattform.',
      'plt-cap1-title': 'Deterministische Validierungs-Engine',
      'plt-cap1-desc': 'Jede Regelauswertung liefert bei gleicher Eingabe dasselbe Ergebnis. Kein probabilistisches Verhalten, keine Laufzeitvarianz. Geeignet f\u00fcr sicherheitskritische Umgebungen.',
      'plt-cap2-title': 'Signalbasierte Regelauswertung',
      'plt-cap2-desc': 'Validierungsregeln arbeiten direkt auf Signalzeitreihen \u2014 CAN, CSV, UART \u2014 nicht auf Code oder Test-Stubs. Echtes Systemverhalten ist die Grundlage.',
      'plt-cap3-title': 'Lokale Ausf\u00fchrung',
      'plt-cap3-desc': 'Die Plattform l\u00e4uft vollst\u00e4ndig on-premise. Keine Cloud-Abh\u00e4ngigkeit, keine Daten\u00fcbertragung, keine externen Dienste. Ihre Signaldaten bleiben in Ihrer Umgebung.',
      'plt-cap4-title': 'Reproduzierbare Validierungs-Workflows',
      'plt-cap4-desc': 'Basis- und optimierte L\u00e4ufe liefern vergleichbare, pr\u00fcfbare Ergebnisse. Vollst\u00e4ndige Nachverfolgung jeder PASS/FAIL-Entscheidung.',
      'plt-par-tag': 'Paradigma',
      'plt-par-title': 'Das Validierungsparadigma',
      'plt-par-sub': 'Eine integrierte Umgebung zur \u00dcbersetzung von Anforderungen in verifizierbare Systemwahrheit.',
      'plt-par1-title': 'DSL: Die einheitliche Schnittstelle',
      'plt-par1-desc': 'Komplexe Systemlogik als pr\u00fcfbare Regeln ausdr\u00fccken. Die Br\u00fccke zwischen menschlicher Anforderung und maschineller Verifikation.',
      'plt-par2-title': 'Deterministische Engine',
      'plt-par2-desc': 'Unsicherheit eliminieren. Jede Anforderung wird gegen Echtzeitsignale mit Mikrosekundenpr\u00e4zision validiert.',
      'plt-par3-title': 'Anforderungsherkunft',
      'plt-par3-desc': 'Direkte R\u00fcckverfolgbarkeit von der signalbasierten Validierung zu \u00fcbergeordneten Anforderungen. Jedes PASS/FAIL hat eine verhaltensbezogene Grundursache.',
      'plt-par4-title': 'Multi-Quellen-Replay',
      'plt-par4-desc': 'CAN-Logs, CSV-Zeitreihen und UART-Traces durch ein einheitliches Adapter-Framework wiedergeben. Ein normiertes Frame-Format f\u00fcr alle Datenquellen.',
      'plt-par5-title': 'Validierungsoptimierung',
      'plt-par5-desc': 'Metrikgesteuertes Auswahlmodul entscheidet, welche Validierungen erneut ausgef\u00fchrt werden. Ziel: 30\u201350% Reduktion der Ausf\u00fchrungskosten.',
      'plt-par6-title': 'Signalqualit\u00e4tsdiagnostik',
      'plt-par6-desc': 'Unterscheidet Systemfehler von Datenqualit\u00e4tsproblemen. UNKNOWN- und WEAK-Ergebnisse verhindern Fehlalarme durch veraltete oder fehlende Signaldaten.',
      'plt-demo-tag': 'Demo',
      'plt-demo-title': 'Ausf\u00fchrbare Anforderungs-Demo',
      'plt-demo-sub': 'Eine \u00fcbergeordnete Sicherheitsanforderung, die gegen Echtzeit-Multi-Signal-Verhalten validiert wird.',
      'plt-flow1': 'Anforderung', 'plt-flow2': 'DSL', 'plt-flow3': 'Validierung', 'plt-flow4': 'Ergebnis',
      'plt-demo-btn': 'Verhalten pr\u00fcfen',
      'plt-dsl-comment': '// "Wenn Geschwindigkeit > 30 und Kollisionsrisiko \u2192 bremsen innerhalb 150ms"',
      'plt-demo-evaluating': 'Engine: Wertet Cross-Signal-Abh\u00e4ngigkeiten aus...',
      'plt-demo-pass': 'Verhalten best\u00e4tigt',
      'plt-demo-result': 'ANFORDERUNG "Emergency_Response" ERF\u00dcLLT.\nBeobachtete Reaktionszeit 25ms < Schwellenwert 150ms.\nKonfidenz: STARK \u00b7 Ergebnis: BESTANDEN',
      'plt-phil-tag': 'Engineering-Philosophie',
      'plt-phil-title': 'Moderne Systeme werden durch Verhalten definiert, nicht durch Code.',
      'plt-phil-left-tag': 'Traditionelles Testen',
      'plt-phil-left-desc': 'Validiert spezifische Implementierungen und Unit-Funktionen. H\u00e4ufig von \u00fcbergeordneten Systemanforderungen entkoppelt, was zu Abdeckungsl\u00fccken bei komplexen Interaktionen f\u00fchrt.',
      'plt-phil-right-tag': 'VeriAI-Paradigma',
      'plt-phil-right-desc': 'Validiert systemseitiges Verhalten direkt aus Anforderungen. Die deterministische Engine stellt sicher, dass sich die physische Welt genau so verh\u00e4lt, wie in der Regelwelt definiert.',
      'plt-phil-boundary': 'Systemgrenze: Das System beobachtet und validiert Signale, kontrolliert oder greift jedoch nicht in die Umgebung ein.',
      'plt-faq-tag': 'FAQ',
      'plt-faq-title': 'H\u00e4ufig gestellte Fragen',
      'plt-faq-q1': 'Muss ich DSL manuell schreiben?',
      'plt-faq-a1': 'Nein. VeriAI transformiert nat\u00fcrlichsprachliche Anforderungen automatisch in ausf\u00fchrbare DSL-Regeln.',
      'plt-faq-q2': 'Was unterscheidet dies von traditionellen Testframeworks?',
      'plt-faq-a2': 'Traditionelles Testen validiert Implementierungen. VeriAI validiert Systemverhalten direkt aus Anforderungen \u2014 unter realen Signalbedingungen.',
      'plt-faq-q3': 'Wie integriert sich DSL in bestehende Toolchains?',
      'plt-faq-a3': 'Das DSL ist eine Abstraktionsschicht, die auf bestehende Testumgebungen, Simulationsframeworks oder reale Hardware-Interfaces abgebildet werden kann.',
      'plt-faq-q4': 'Welche Signaltypen und Schnittstellen werden unterst\u00fctzt?',
      'plt-faq-a4': 'CAN, Ethernet und analoge Signale. Die Plattform validiert Cross-Signal-Abh\u00e4ngigkeiten und zeitliches Verhalten in heterogenen Multi-Signal-Umgebungen.',
      'plt-faq-q5': 'Simulation oder echte Hardware?',
      'plt-faq-a5': 'Beides. Konsistente Validierungslogik unabh\u00e4ngig von der Ausf\u00fchrungsumgebung \u2014 Simulationsmodelle oder reale Hardware-Signaleingaben.',
      'plt-faq-q6': 'Steuert VeriAI das System unter Test?',
      'plt-faq-a6': 'Nein. VeriAI beobachtet und bewertet ausschlie\u00dflich Signale. Es kontrolliert die Umgebung nicht.',
      'plt-faq-q7': 'Basiert die Plattform auf cloud-basierter KI?',
      'plt-faq-a7': 'Nein. Alle Verarbeitung erfolgt lokal mit kontrollierter Transformationslogik. Dies gew\u00e4hrleistet deterministisches Verhalten und Reproduzierbarkeit.',
      'plt-faq-q8': 'Unterst\u00fctzt die Plattform CAN-Logs und UART-Traces?',
      'plt-faq-a8': 'Ja. Replay-Adapter f\u00fcr CAN-Candump (mit DBC-Dekodierung), CSV-Zeitreihen und UART-Logs. Alle Quellen in ein einheitliches Frame-Format normiert.',
      'plt-faq-q9': 'Wie funktioniert die Validierungsoptimierungsschleife?',
      'plt-faq-a9': 'Ein vollst\u00e4ndiger Baseline-Lauf sammelt Metriken pro Test. Eine deterministische Auswahlmaschine bestimmt, welche Validierungen erneut ausgef\u00fchrt werden m\u00fcssen.',
      'plt-faq-q10': 'In welchem Stadium befindet sich die Plattform?',
      'plt-faq-a10': 'Fr\u00fche Entwicklungsphase. Kern-DSL, Validierungs-Engine und Signal-Adapter werden aktiv prototypisiert.',
      'plt-contact-tag': 'Kontakt',
      'plt-contact-title': 'Kontakt aufnehmen',
      'plt-contact-sub': 'Direkte Kan\u00e4le \u2014 keine Formulare, keine Vermittler.',
      'plt-contact-eng-label': 'Engineering-Anfragen',
      'plt-contact-eng-desc': 'Technische Fragen, Validierungssystem, DSL, Integration.',
      'plt-contact-gen-label': 'Allgemeine Anfragen',
      'plt-contact-gen-desc': 'Partnerschaften, Early-Access-Anfragen, allgemeine Informationen.',
      'products-tag': 'Produkte',
      'products-heading': 'Engineering-Validierungsprodukte.',
      'products-sub': 'Signalbasierte Validierungswerkzeuge f\u00fcr Embedded-Systems-Teams. Weitere Anwendungsdom\u00e4nen werden f\u00fcr k\u00fcnftige Versionen evaluiert.',
      'future-tag': 'Zuk\u00fcnftige Anwendungen',
      'future-heading': 'Die Plattformarchitektur ist f\u00fcr Erweiterungen ausgelegt.',
      'future-sub': 'Aktueller Fokus: Engineering-Validierung \u00b7 Zuk\u00fcnftige Dom\u00e4nen: in Evaluation',
      'future-1-title': 'Compliance-Testausf\u00fchrung',
      'future-1-desc': 'Strukturierte Testsuite-Ausf\u00fchrung mit R\u00fcckverfolgbarkeit zu regulatorischen Anforderungen. Eine potenzielle Erweiterung f\u00fcr regulierte Branchen \u2014 kein aktuelles Produkt.',
      'future-2-title': 'Dom\u00e4nen\u00fcbergreifende Anforderungsverkn\u00fcpfung',
      'future-2-desc': 'Nachverfolgbarkeit zwischen systemseitigen Anforderungen, Teilsystemspezifikationen und Validierungsnachweisen \u00fcber Organisationsgrenzen hinweg.',
      'future-3-title': 'Validierungsanalysen',
      'future-3-desc': 'Aggregierte Kennzahlen \u00fcber Validierungsl\u00e4ufe, Teams und Produktlinien. Langfristige Trendanalyse zu Abdeckung, Instabilit\u00e4t und Fehlerquoten.',
      'future-note': 'Die Engineering-Validierungssuite verwendet eine modulare Adapterarchitektur. Weitere Anwendungsdom\u00e4nen k\u00f6nnen hinzugef\u00fcgt werden, ohne die Kern-Validierungs-Engine oder bestehende Produkte umzustrukturieren.'
    },
    zh: {
      'nav-platform': '\u5e73\u53f0',
      'nav-products': '\u4ea7\u54c1',
      'hero-tag': '\u786e\u5b9a\u6027\u9a8c\u8bc1\u5f15\u64ce\u5df2\u6fc0\u6d3b',
      'hero-title': '\u5b89\u5168\u5173\u952e\u5d4c\u5165\u5f0f\u7cfb\u7edf\u7684\u53ef\u6267\u884c\u9a8c\u8bc1\u5e73\u53f0',
      'hero-subtitle': '\u5c06\u9700\u6c42\u8f6c\u5316\u4e3a\u786e\u5b9a\u6027\u9a8c\u8bc1\u3002\u4ece\u7ed3\u6784\u5316 DSL \u5230\u771f\u5b9e\u4fe1\u53f7\u884c\u4e3a\u3002\u5b8c\u5168\u672c\u5730\u6267\u884c\u3002',
      'hero-signal': '\u81ea\u7136\u8bed\u8a00 \u2192 \u7ed3\u6784\u5316 DSL \u2192 \u786e\u5b9a\u6027\u9a8c\u8bc1',
      'hero-detail': '\u672c\u5730\u5904\u7406 \u00b7 \u65e0\u4e91\u7aef \u00b7 \u65e0\u9ed1\u76d2\u63a8\u65ad',
      'hero-tagline': '\u4ece\u9700\u6c42\u5230\u9a8c\u8bc1 \u2014\u2014 \u6d88\u9664\u6b67\u4e49\u3002',
      'cta-platform': '\u63a2\u7d22\u5e73\u53f0',
      'cta-products': '\u67e5\u770b\u4ea7\u54c1',
      'overview-tag': '\u67b6\u6784',
      'overview-heading': '\u4e09\u5c42\u9a8c\u8bc1\u57fa\u7840\u8bbe\u65bd\u3002',
      'overview-dsl-title': 'DSL \u63a5\u53e3',
      'overview-dsl-desc': '\u9700\u6c42\u901a\u8fc7\u53d7\u63a7\u8f6c\u6362\u903b\u8f91\u8f6c\u5316\u4e3a\u53ef\u6267\u884c\u89c4\u5219\u3002',
      'overview-engine-title': '\u9a8c\u8bc1\u5f15\u64ce',
      'overview-engine-desc': '\u786e\u5b9a\u6027\u89c4\u5219\u8bc4\u4f30\u3002\u76f8\u540c\u8f93\u5165 \u2014 \u76f8\u540c\u8f93\u51fa\u3002\u59cb\u7ec8\u5982\u4e00\u3002',
      'overview-signals-title': '\u4fe1\u53f7\u57df',
      'overview-signals-desc': 'CAN\u3001CSV\u3001UART \u2014\u2014 \u771f\u5b9e\u7cfb\u7edf\u884c\u4e3a\u662f\u6700\u7ec8\u4f9d\u636e\u3002',
      'eng-domain-tag': '\u5de5\u7a0b\u9a8c\u8bc1',
      'eng-domain-heading': '\u9762\u5411\u5d4c\u5165\u5f0f\u7cfb\u7edf\u5de5\u7a0b\u5e08\u7684\u57fa\u4e8e\u4fe1\u53f7\u7684\u9a8c\u8bc1\u5de5\u5177\u3002',
      'prod-realtime-title': '\u5b9e\u65f6\u4fe1\u53f7\u9a8c\u8bc1',
      'prod-realtime-desc': '\u5b9e\u65f6\u9a8c\u8bc1 CAN \u548c UART \u4fe1\u53f7\u662f\u5426\u7b26\u5408 DSL \u89c4\u5219\u3002',
      'prod-sim-title': '\u4eff\u771f\u9a8c\u8bc1',
      'prod-sim-desc': '\u9488\u5bf9 DSL \u5b9a\u4e49\u89c4\u8303\u7684\u8f6f\u4ef6\u5728\u73af\u884c\u4e3a\u9a8c\u8bc1\u3002',
      'prod-hil-title': 'HIL \u6d4b\u8bd5',
      'prod-hil-desc': '\u5177\u6709\u786e\u5b9a\u6027\u89c4\u5219\u8bc4\u4f30\u7684\u786c\u4ef6\u5728\u73af\u95ed\u73af ECU \u6d4b\u8bd5\u3002',
      'prod-log-title': '\u65e5\u5fd7\u56de\u653e\u4e0e\u5206\u6790',
      'prod-log-desc': '\u5c06 CAN candump\u3001CSV \u65f6\u5e8f\u548c UART \u65e5\u5fd7\u56de\u653e\u5e76\u5bf9\u7167\u89c4\u5219\u96c6\u8fdb\u884c\u9a8c\u8bc1\u3002',
      'cmp-domain-tag': '\u5408\u89c4\u5de5\u5177',
      'cmp-domain-heading': '\u9002\u7528\u4e8e\u53d7\u76d1\u7ba1\u73af\u5883\u7684\u7ed3\u6784\u5316\u6d4b\u8bd5\u6267\u884c\u3002',
      'prod-tse-title': 'TSE \u2014 \u6d4b\u8bd5\u5957\u4ef6\u6267\u884c',
      'prod-tse-desc': '\u7ed3\u6784\u5316\u5408\u89c4\u6d4b\u8bd5\u6267\u884c\uff0c\u5b8c\u6574\u8ffd\u6eaf\u81f3\u9700\u6c42\u3002\u9762\u5411\u53d7\u76d1\u7ba1\u884c\u4e1a\u7684\u5ba1\u8ba1\u5c31\u7eea\u8f93\u51fa\u3002',
      'footer-tagline': '\u53ef\u6267\u884c\u9a8c\u8bc1\u5e73\u53f0',
      'footer-status': '\u539f\u578b \u00b7 \u79ef\u6781\u5f00\u53d1\u4e2d',
      'footer-navigation': '\u5bfc\u822a',
      'nav-language': '\u8bed\u8a00',
      'footer-legal': '\u6cd5\u5f8b',
      'footer-impressum': '\u6cd5\u5f8b\u58f0\u660e',
      'footer-privacy': '\u9690\u79c1\u653f\u7b56',
      'footer-legal-hint': '\u672c\u7f51\u7ad9\u5c55\u793a\u7684\u662f\u4e00\u4e2a\u6b63\u5728\u79ef\u6781\u5f00\u53d1\u4e2d\u7684\u539f\u578b\u5de5\u7a0b\u7cfb\u7edf\u3002',
      // Platform page — ZH
      'plt-tag': '\u5e73\u53f0',
      'plt-title': '\u5de5\u7a0b\u7ea7\u9a8c\u8bc1\u57fa\u7840\u8bbe\u65bd\u3002',
      'plt-sub': '\u786e\u5b9a\u6027\u3002\u672c\u5730\u3002\u53ef\u8ffd\u6eaf\u3002\u4ece\u81ea\u7136\u8bed\u8a00\u9700\u6c42\u5230\u53ef\u6267\u884c\u9a8c\u8bc1 \u2014\u2014 \u65e0\u9ed1\u76d2\u5904\u7406\u3002',
      'plt-how-tag': '\u5de5\u4f5c\u539f\u7406',
      'plt-how-title': '\u4ece\u9700\u6c42\u5230\u9a8c\u8bc1\u7ed3\u679c\uff0c\u4e09\u4e2a\u6b65\u9aa4\u3002',
      'plt-step1-num': '01', 'plt-step2-num': '02', 'plt-step3-num': '03',
      'plt-step1-title': '\u81ea\u7136\u8bed\u8a00\u9700\u6c42',
      'plt-step1-desc': '\u7528\u666e\u901a\u8bed\u8a00\u63cf\u8ff0\u9884\u671f\u7684\u7cfb\u7edf\u884c\u4e3a\u3002\u65e0\u9700\u6b63\u5f0f\u89c4\u8303\u8bed\u6cd5\u3002\u652f\u6301\u82f1\u8bed\u3001\u5fb7\u8bed\u6216\u4e2d\u6587\u3002',
      'plt-step2-title': '\u7ed3\u6784\u5316 DSL \u8f6c\u6362',
      'plt-step2-desc': '\u9700\u6c42\u901a\u8fc7\u53d7\u63a7\u8f6c\u6362\u903b\u8f91\u89e3\u6790\u4e3a\u786e\u5b9a\u6027 DSL \u89c4\u5219\u3002\u65e0\u6b67\u4e49\uff0c\u65e0\u89e3\u91ca\u9e3d\u6c9f\uff0c\u65e0\u9ed1\u76d2\u5904\u7406\u3002',
      'plt-step3-title': '\u786e\u5b9a\u6027\u9a8c\u8bc1',
      'plt-step3-desc': '\u89c4\u5219\u5bf9\u771f\u5b9e\u4fe1\u53f7\u6570\u636e\u6267\u884c \u2014\u2014 CAN\u3001CSV\u3001UART\u3002\u6bcf\u6b21\u9a8c\u8bc1\u5747\u4ea7\u751f\u53ef\u8ffd\u6eaf\u3001\u53ef\u91cd\u73b0\u7684\u7ed3\u679c\uff0c\u5305\u542b\u5b8c\u6574\u5ba1\u8ba1\u8f68\u8ff9\u3002',
      'plt-how-anchor': '\u4e13\u4e3a\u771f\u5b9e\u4fe1\u53f7\u9a8c\u8bc1\u73af\u5883\u8bbe\u8ba1\uff08CAN\u3001\u4ee5\u592a\u7f51\u3001\u6a21\u62df\u4fe1\u53f7\uff09',
      'plt-cap-tag': '\u80fd\u529b',
      'plt-cap-title': '\u5e73\u53f0\u6838\u5fc3\u80fd\u529b\u3002',
      'plt-cap1-title': '\u786e\u5b9a\u6027\u9a8c\u8bc1\u5f15\u64ce',
      'plt-cap1-desc': '\u76f8\u540c\u8f93\u5165\u59cb\u7ec8\u4ea7\u751f\u76f8\u540c\u7ed3\u679c\u3002\u65e0\u6982\u7387\u884c\u4e3a\uff0c\u65e0\u8fd0\u884c\u65f6\u5dee\u5f02\u3002\u9002\u7528\u4e8e\u5b89\u5168\u5173\u952e\u73af\u5883\u3002',
      'plt-cap2-title': '\u57fa\u4e8e\u4fe1\u53f7\u7684\u89c4\u5219\u8bc4\u4f30',
      'plt-cap2-desc': '\u9a8c\u8bc1\u89c4\u5219\u76f4\u63a5\u5bf9\u4fe1\u53f7\u65f6\u95f4\u8f74\u8fd0\u884c \u2014\u2014 CAN\u3001CSV\u3001UART \u2014\u2014 \u800c\u975e\u4ee3\u7801\u6216\u6d4b\u8bd5\u6a29\u3002\u771f\u5b9e\u7cfb\u7edf\u884c\u4e3a\u662f\u6700\u7ec8\u4f9d\u636e\u3002',
      'plt-cap3-title': '\u672c\u5730\u6267\u884c',
      'plt-cap3-desc': '\u5e73\u53f0\u5168\u90e8\u5728\u672c\u5730\u8fd0\u884c\u3002\u65e0\u4e91\u7aef\u4f9d\u8d56\uff0c\u65e0\u6570\u636e\u4f20\u8f93\uff0c\u65e0\u9700\u5916\u90e8\u670d\u52a1\u3002\u4fe1\u53f7\u6570\u636e\u59cb\u7ec8\u7559\u5728\u60a8\u7684\u73af\u5883\u5185\u3002',
      'plt-cap4-title': '\u53ef\u91cd\u73b0\u7684\u9a8c\u8bc1\u5de5\u4f5c\u6d41',
      'plt-cap4-desc': '\u57fa\u7ebf\u548c\u4f18\u5316\u8fd0\u884c\u4ea7\u751f\u53ef\u6bd4\u8f83\u3001\u53ef\u5ba1\u8ba1\u7684\u7ed3\u679c\u3002\u6bcf\u4e2a PASS/FAIL \u51b3\u5b9a\u5747\u6709\u5b8c\u6574\u8f68\u8ff9\u3002',
      'plt-par-tag': '\u8303\u5f0f',
      'plt-par-title': '\u9a8c\u8bc1\u8303\u5f0f',
      'plt-par-sub': '\u5c06\u9700\u6c42\u8f6c\u5316\u4e3a\u53ef\u9a8c\u8bc1\u7cfb\u7edf\u771f\u7406\u7684\u96c6\u6210\u73af\u5883\u3002',
      'plt-par1-title': 'DSL\uff1a\u7edf\u4e00\u63a5\u53e3',
      'plt-par1-desc': '\u5c06\u590d\u6742\u7cfb\u7edf\u903b\u8f91\u8868\u8fbe\u4e3a\u53ef\u9a8c\u8bc1\u89c4\u5219\u3002\u4eba\u7c7b\u9700\u6c42\u4e0e\u673a\u5668\u9a8c\u8bc1\u4e4b\u95f4\u7684\u6865\u6881\u3002',
      'plt-par2-title': '\u786e\u5b9a\u6027\u5f15\u64ce',
      'plt-par2-desc': '\u6d88\u9664\u4e0d\u786e\u5b9a\u6027\u3002\u6bcf\u4e2a\u9700\u6c42\u5747\u4ee5\u5fae\u79d2\u7ea7\u7cbe\u5ea6\u5bf9\u5b9e\u65f6\u4fe1\u53f7\u8fdb\u884c\u9a8c\u8bc1\u3002',
      'plt-par3-title': '\u9700\u6c42\u6e90\u5934',
      'plt-par3-desc': '\u4fe1\u53f7\u7ea7\u9a8c\u8bc1\u76f4\u63a5\u56de\u6eaf\u81f3\u9ad8\u5c42\u9700\u6c42\u3002\u6bcf\u4e2a PASS/FAIL \u5747\u6709\u884c\u4e3a\u7ea7\u6839\u672c\u539f\u56e0\u3002',
      'plt-par4-title': '\u591a\u6e90\u5934\u56de\u653e',
      'plt-par4-desc': '\u5c06 CAN \u65e5\u5fd7\u3001CSV \u65f6\u95f4\u8f74\u548c UART \u8f68\u8ff9\u901a\u8fc7\u7edf\u4e00\u9002\u914d\u5668\u6846\u67b6\u56de\u653e\u3002\u6240\u6709\u6570\u636e\u6e90\u91c7\u7528\u4e00\u79cd\u89c4\u8303\u5316\u5e27\u683c\u5f0f\u3002',
      'plt-par5-title': '\u9a8c\u8bc1\u4f18\u5316',
      'plt-par5-desc': '\u6307\u6807\u9a71\u52a8\u7684\u9009\u62e9\u5f15\u64ce\u51b3\u5b9a\u91cd\u65b0\u6267\u884c\u54ea\u4e9b\u9a8c\u8bc1\u3002\u76ee\u6807\u5c06\u6267\u884c\u6210\u672c\u964d\u4f4e 30\u201350%\u3002',
      'plt-par6-title': '\u4fe1\u53f7\u8d28\u91cf\u8bca\u65ad',
      'plt-par6-desc': '\u533a\u5206\u7cfb\u7edf\u6545\u969c\u4e0e\u6570\u636e\u8d28\u91cf\u95ee\u9898\u3002UNKNOWN \u548c WEAK \u7ed3\u679c\u53ef\u9632\u6b62\u56e0\u4fe1\u53f7\u6570\u636e\u9677\u65e7\u6216\u7f3a\u5931\u5bfc\u81f4\u7684\u8bef\u62a5\u8b66\u3002',
      'plt-demo-tag': '\u6f14\u793a',
      'plt-demo-title': '\u53ef\u6267\u884c\u9700\u6c42\u6f14\u793a',
      'plt-demo-sub': '\u9488\u5bf9\u5b9e\u65f6\u8de8\u4fe1\u53f7\u884c\u4e3a\u9a8c\u8bc1\u7684\u9ad8\u5c42\u5b89\u5168\u9700\u6c42\u3002',
      'plt-flow1': '\u9700\u6c42', 'plt-flow2': 'DSL', 'plt-flow3': '\u9a8c\u8bc1', 'plt-flow4': '\u7ed3\u679c',
      'plt-demo-btn': '\u9a8c\u8bc1\u884c\u4e3a',
      'plt-dsl-comment': '// \u201c\u5982\u679c\u901f\u5ea6 > 30 \u4e14\u78b0\u649e\u98ce\u9669 \u2192 150ms \u5185\u5236\u52a8\u201d',
      'plt-demo-evaluating': '\u5f15\u64ce\uff1a\u6b63\u5728\u8bc4\u4f30\u8de8\u4fe1\u53f7\u4f9d\u8d56\u5173\u7cfb\u2026',
      'plt-demo-pass': '\u884c\u4e3a\u5df2\u9a8c\u8bc1',
      'plt-demo-result': '\u9700\u6c42 \u201cEmergency_Response\u201d \u5df2\u6ee1\u8db3\u3002\n\u89c2\u6d4b\u5230\u7684\u53cd\u5e94\u65f6\u95f4 25ms < \u9608\u5024 150ms\u3002\n\u7f6e\u4fe1\u5ea6\uff1a\u5f3a \u00b7 \u7ed3\u679c\uff1a\u901a\u8fc7',
      'plt-phil-tag': '\u5de5\u7a0b\u54f2\u5b66',
      'plt-phil-title': '\u73b0\u4ee3\u7cfb\u7edf\u7531\u884c\u4e3a\u5b9a\u4e49\uff0c\u800c\u975e\u4ee3\u7801\u3002',
      'plt-phil-left-tag': '\u4f20\u7edf\u6d4b\u8bd5',
      'plt-phil-left-desc': '\u9a8c\u8bc1\u5177\u4f53\u5b9e\u73b0\u548c\u5355\u5143\u7ea7\u529f\u80fd\u3002\u901a\u5e38\u4e0e\u9ad8\u5c42\u7cfb\u7edf\u9700\u6c42\u8131\u8282\uff0c\u5bfc\u81f4\u590d\u6742\u4ea4\u4e92\u4e2d\u51fa\u73b0\u8986\u76d6\u76f2\u533a\u3002',
      'plt-phil-right-tag': 'VeriAI \u8303\u5f0f',
      'plt-phil-right-desc': '\u76f4\u63a5\u9a8c\u8bc1\u7531\u9700\u6c42\u5b9a\u4e49\u7684\u7cfb\u7edf\u7ea7\u884c\u4e3a\u3002\u786e\u5b9a\u6027\u5f15\u64ce\u786e\u4fdd\u7269\u7406\u4e16\u754c\u7684\u8868\u73b0\u4e0e\u89c4\u5219\u4e16\u754c\u7684\u5b9a\u4e49\u5b8c\u5168\u4e00\u81f4\u3002',
      'plt-phil-boundary': '\u7cfb\u7edf\u8fb9\u754c\uff1a\u7cfb\u7edf\u4ec5\u89c2\u5bdf\u548c\u9a8c\u8bc1\u4fe1\u53f7\uff0c\u4e0d\u63a7\u5236\u6216\u5e72\u9884\u73af\u5883\u672c\u8eab\u3002',
      'plt-faq-tag': '\u5e38\u89c1\u95ee\u9898',
      'plt-faq-title': '\u5e38\u89c1\u95ee\u9898\u89e3\u7b54',
      'plt-faq-q1': '\u9700\u8981\u624b\u52a8\u7f16\u5199 DSL \u5417\uff1f',
      'plt-faq-a1': '\u4e0d\u9700\u8981\u3002VeriAI \u901a\u8fc7\u53d7\u63a7\u8f6c\u6362\u903b\u8f91\u81ea\u52a8\u5c06\u81ea\u7136\u8bed\u8a00\u9700\u6c42\u8f6c\u5316\u4e3a\u53ef\u6267\u884c\u7684 DSL \u89c4\u5219\u3002',
      'plt-faq-q2': '\u8fd9\u4e0e\u4f20\u7edf\u6d4b\u8bd5\u6709\u4f55\u4e0d\u540c\uff1f',
      'plt-faq-a2': '\u4f20\u7edf\u6d4b\u8bd5\u9a8c\u8bc1\u5b9e\u73b0\u3002VeriAI \u76f4\u63a5\u4ece\u9700\u6c42\u51fa\u53d1\u9a8c\u8bc1\u7cfb\u7edf\u884c\u4e3a \u2014\u2014 \u5728\u771f\u5b9e\u4fe1\u53f7\u6761\u4ef6\u4e0b\u3002',
      'plt-faq-q3': 'DSL \u5982\u4f55\u4e0e\u73b0\u6709\u5de5\u5177\u94fe\u96c6\u6210\uff1f',
      'plt-faq-a3': 'DSL \u662f\u4e00\u4e2a\u62bd\u8c61\u5c42\uff0c\u53ef\u6620\u5c04\u5230\u73b0\u6709\u6d4b\u8bd5\u73af\u5883\u3001\u4eff\u771f\u6846\u67b6\u6216\u771f\u5b9e\u786c\u4ef6\u63a5\u53e3\u3002\u5b83\u5728\u73b0\u6709\u6808\u4e4b\u4e0a\u589e\u52a0\u4e00\u4e2a\u786e\u5b9a\u6027\u9a8c\u8bc1\u5c42\u3002',
      'plt-faq-q4': '\u652f\u6301\u54ea\u4e9b\u4fe1\u53f7\u7c7b\u578b\u548c\u63a5\u53e3\uff1f',
      'plt-faq-a4': 'CAN\u3001\u4ee5\u592a\u7f51\u548c\u6a21\u62df\u4fe1\u53f7\u3002\u5e73\u53f0\u5bf9\u5f02\u6784\u591a\u4fe1\u53f7\u73af\u5883\u4e2d\u7684\u8de8\u4fe1\u53f7\u4f9d\u8d56\u5173\u7cfb\u548c\u65f6\u5e8f\u884c\u4e3a\u8fdb\u884c\u9a8c\u8bc1\u3002',
      'plt-faq-q5': '\u4eff\u771f\u8fd8\u662f\u771f\u5b9e\u786c\u4ef6\uff1f',
      'plt-faq-a5': '\u4e24\u8005\u5747\u652f\u6301\u3002\u65e0\u8bba\u6267\u884c\u73af\u5883\u5982\u4f55\uff0c\u9a8c\u8bc1\u903b\u8f91\u4fdd\u6301\u4e00\u81f4 \u2014\u2014 \u4eff\u771f\u6a21\u578b\u6216\u771f\u5b9e\u786c\u4ef6\u4fe1\u53f7\u8f93\u5165\u3002',
      'plt-faq-q6': 'VeriAI \u63a7\u5236\u88ab\u6d4b\u7cfb\u7edf\u5417\uff1f',
      'plt-faq-a6': '\u4e0d\u3002VeriAI \u4ec5\u89c2\u5bdf\u548c\u8bc4\u4f30\u4fe1\u53f7\u3002\u4e0d\u63a7\u5236\u6216\u5e72\u9884\u7cfb\u7edf\u6216\u73af\u5883\u3002',
      'plt-faq-q7': '\u5e73\u53f0\u662f\u5426\u4f9d\u8d56\u4e91\u7aef AI\uff1f',
      'plt-faq-a7': '\u4e0d\u3002\u6240\u6709\u5904\u7406\u5747\u5728\u672c\u5730\u8fdb\u884c\uff0c\u91c7\u7528\u53d7\u63a7\u8f6c\u6362\u903b\u8f91\u3002\u786e\u4fdd\u786e\u5b9a\u6027\u884c\u4e3a\u548c\u53ef\u91cd\u73b0\u6027\u3002',
      'plt-faq-q8': '\u5e73\u53f0\u662f\u5426\u652f\u6301 CAN \u65e5\u5fd7\u548c UART \u8f68\u8ff9\uff1f',
      'plt-faq-a8': '\u652f\u6301\u3002\u5305\u542b CAN candump\uff08\u5e26 DBC \u89e3\u7801\uff09\u3001CSV \u4fe1\u53f7\u65f6\u95f4\u8f74\u548c UART \u65e5\u5fd7\u7684\u56de\u653e\u9002\u914d\u5668\u3002\u6240\u6709\u6e90\u5747\u89c4\u8303\u5316\u4e3a\u7edf\u4e00\u5e27\u683c\u5f0f\u3002',
      'plt-faq-q9': '\u9a8c\u8bc1\u4f18\u5316\u5faa\u73af\u5982\u4f55\u5de5\u4f5c\uff1f',
      'plt-faq-a9': '\u5b8c\u6574\u57fa\u7ebf\u8fd0\u884c\u6536\u96c6\u6bcf\u4e2a\u6d4b\u8bd5\u7684\u6307\u6807\u3002\u786e\u5b9a\u6027\u51b3\u7b56\u5f15\u64ce\u9009\u62e9\u9700\u8981\u91cd\u65b0\u6267\u884c\u7684\u9a8c\u8bc1\u3002\u76ee\u6807\u5c06\u6267\u884c\u6210\u672c\u964d\u4f4e 30\u201350%\u3002',
      'plt-faq-q10': '\u5e73\u53f0\u76ee\u524d\u5904\u4e8e\u4ec0\u4e48\u9636\u6bb5\uff1f',
      'plt-faq-a10': '\u65e9\u671f\u5f00\u53d1\u9636\u6bb5\u3002\u6838\u5fc3 DSL\u3001\u9a8c\u8bc1\u5f15\u64ce\u548c\u4fe1\u53f7\u9002\u914d\u5668\u6b63\u5728\u79ef\u6781\u539f\u578b\u5316\u3002',
      'plt-contact-tag': '\u8054\u7cfb',
      'plt-contact-title': '\u8054\u7cfb\u6211\u4eec',
      'plt-contact-sub': '\u76f4\u63a5\u6e20\u9053 \u2014\u2014 \u65e0\u8868\u5355\uff0c\u65e0\u4e2d\u95f4\u5546\u3002',
      'plt-contact-eng-label': '\u5de5\u7a0b\u5496\u8be2',
      'plt-contact-eng-desc': '\u6280\u672f\u95ee\u9898\u3001\u9a8c\u8bc1\u7cfb\u7edf\u3001DSL\u3001\u96c6\u6210\u3002',
      'plt-contact-gen-label': '\u4e00\u822c\u548c\u8be2',
      'plt-contact-gen-desc': '\u5408\u4f5c\u3001\u65e9\u671f\u8bbf\u95ee\u7533\u8bf7\u3001\u4e00\u822c\u4fe1\u606f\u3002',
      'products-tag': '\u4ea7\u54c1',
      'products-heading': '\u5de5\u7a0b\u9a8c\u8bc1\u4ea7\u54c1\u3002',
      'products-sub': '\u9762\u5411\u5d4c\u5165\u5f0f\u7cfb\u7edf\u56e2\u961f\u7684\u57fa\u4e8e\u4fe1\u53f7\u7684\u9a8c\u8bc1\u5de5\u5177\u3002\u66f4\u591a\u5e94\u7528\u9886\u57df\u6b63\u5728\u8bc4\u4f30\u4e2d\uff0c\u5c06\u5728\u672a\u6765\u7248\u672c\u4e2d\u5f15\u5165\u3002',
      'future-tag': '\u672a\u6765\u5e94\u7528',
      'future-heading': '\u5e73\u53f0\u67b6\u6784\u4e13\u4e3a\u6269\u5c55\u800c\u8bbe\u8ba1\u3002',
      'future-sub': '\u5f53\u524d\u91cd\u70b9\uff1a\u5de5\u7a0b\u9a8c\u8bc1 \u00b7 \u672a\u6765\u9886\u57df\uff1a\u8bc4\u4f30\u4e2d',
      'future-1-title': '\u5408\u89c4\u6d4b\u8bd5\u6267\u884c',
      'future-1-desc': '\u5177\u6709\u5bf9\u76d1\u7ba1\u8981\u6c42\u5b8c\u6574\u53ef\u8ffd\u6eaf\u6027\u7684\u7ed3\u6784\u5316\u6d4b\u8bd5\u5957\u4ef6\u6267\u884c\u3002\u9762\u5411\u53d7\u76d1\u7ba1\u884c\u4e1a\u7684\u6f5c\u5728\u6269\u5c55 \u2014\u2014 \u76ee\u524d\u975e\u4ea7\u54c1\u3002',
      'future-2-title': '\u8de8\u9886\u57df\u9700\u6c42\u5173\u8054',
      'future-2-desc': '\u8de8\u7ec4\u7ec7\u8fb9\u754c\u7684\u7cfb\u7edf\u7ea7\u9700\u6c42\u3001\u5b50\u7cfb\u7edf\u89c4\u8303\u4e0e\u9a8c\u8bc1\u8bc1\u636e\u4e4b\u95f4\u7684\u53ef\u8ffd\u6eaf\u6027\u3002',
      'future-3-title': '\u9a8c\u8bc1\u5206\u6790',
      'future-3-desc': '\u8de8\u9a8c\u8bc1\u8fd0\u884c\u3001\u56e2\u961f\u548c\u4ea7\u54c1\u7ebf\u7684\u805a\u5408\u6307\u6807\u3002\u5bf9\u8986\u76d6\u7387\u3001\u4e0d\u7a33\u5b9a\u6027\u548c\u6545\u969c\u7387\u7684\u957f\u671f\u8d8b\u52bf\u5206\u6790\u3002',
      'future-note': '\u5de5\u7a0b\u9a8c\u8bc1\u5957\u4ef6\u91c7\u7528\u6a21\u5757\u5316\u9002\u914d\u5668\u67b6\u6784\u3002\u65e0\u9700\u91cd\u6784\u6838\u5fc3\u9a8c\u8bc1\u5f15\u64ce\u6216\u73b0\u6709\u4ea7\u54c1\uff0c\u5373\u53ef\u5f15\u5165\u989d\u5916\u5e94\u7528\u9886\u57df\u3002'
    }
  };

  function applyTranslations(lang) {
    var t = translations[lang] || translations.en;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) el.textContent = t[key];
    });
    // Highlight active lang button
    ['en', 'de', 'zh'].forEach(function (l) {
      var btn = document.getElementById('lang-' + l);
      if (btn) {
        btn.classList.toggle('text-blue-400', l === lang);
        btn.classList.toggle('text-slate-500', l !== lang);
      }
    });
  }

  function setLang(lang) {
    localStorage.setItem('lang', lang);
    applyTranslations(lang);
  }

  // ── MOBILE MENU ───────────────────────────────────────────────────────────────
  function toggleMobileMenu() {
    var menu = document.getElementById('mobile-menu');
    if (!menu) return;
    var isOpen = !menu.classList.contains('translate-x-full');
    menu.classList.toggle('translate-x-full', isOpen);
    var openIcon = document.getElementById('menu-icon-open');
    var closeIcon = document.getElementById('menu-icon-close');
    if (openIcon) openIcon.classList.toggle('hidden', !isOpen);
    if (closeIcon) closeIcon.classList.toggle('hidden', isOpen);
  }

  // ── SCROLL UTILITY ────────────────────────────────────────────────────────────
  function scrollToId(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  // ── PAGE INIT ─────────────────────────────────────────────────────────────────
  // config: { auth: bool, sections: [{ slot: '#id', src: 'relative/path.html' }] }
  function initPage(config) {
    config = config || {};
    initTheme();
    if (config.auth !== false) requireAuth();

    var root = ROOT;
    var tasks = [
      loadHTML('#navbar-slot', root + 'components/navbar.html'),
      loadHTML('#footer-slot', root + 'components/footer.html')
    ];

    if (config.sections) {
      config.sections.forEach(function (s) {
        tasks.push(loadHTML(s.slot, root + s.src));
      });
    }

    return Promise.all(tasks).then(function () {
      var lang = localStorage.getItem('lang') || 'en';
      applyTranslations(lang);
      if (window.lucide) lucide.createIcons();
    });
  }

  // ── EXPORTS ───────────────────────────────────────────────────────────────────
  window.VeriAI = { initPage: initPage, setLang: setLang, toggleTheme: toggleTheme, toggleMobileMenu: toggleMobileMenu, signOut: signOut, scrollToId: scrollToId };
  window.setLang = setLang;
  window.toggleTheme = toggleTheme;
  window.toggleMobileMenu = toggleMobileMenu;
  window.signOut = signOut;
  window.scrollToId = scrollToId;

})();
