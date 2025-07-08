import React from 'react';

interface InstagramWidgetProps {
  banner?: boolean;
}

const InstagramWidget: React.FC<InstagramWidgetProps> = ({ banner }) => {
  if (banner) {
    // Banner format: wide, responsive, mobile-friendly
    return (
      <div
        style={{
          width: '100%',
          maxWidth: 900,
          margin: '0 auto',
          padding: '1.5rem 0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
          borderRadius: 32,
          boxShadow: '0 8px 32px 0 rgba(60, 0, 120, 0.18)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            background: 'rgba(30, 27, 75, 0.95)',
            borderRadius: 24,
            boxShadow: '0 4px 24px 0 rgba(60, 0, 120, 0.10)',
            padding: 16,
            width: '100%',
            maxWidth: 820,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 32,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, color: '#a78bfa', fontSize: 22, marginBottom: 8, letterSpacing: 1 }}>
              Follow Us On Instagram
            </div>
            <a
              href="https://www.instagram.com/devtone_agency/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#fff',
                background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
                padding: '8px 22px',
                borderRadius: 999,
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 2px 8px 0 rgba(124, 58, 237, 0.10)',
                transition: 'background 0.2s',
                display: 'inline-block',
                fontSize: 16,
              }}
            >
              View Profile
            </a>
          </div>
          <div style={{ flex: 2, minWidth: 0, display: 'flex', justifyContent: 'flex-end' }}>
            <iframe
              src="https://www.instagram.com/devtone_agency/embed/"
              width="340"
              height="440"
              frameBorder="0"
              scrolling="no"
              allowTransparency={true}
              style={{ border: 'none', overflow: 'hidden', borderRadius: 16, background: '#fff', width: '100%', maxWidth: 340 }}
              title="Instagram Widget"
            ></iframe>
          </div>
        </div>
        {/* Mobile styles */}
        <style>{`
          @media (max-width: 900px) {
            .ig-banner-flex {
              flex-direction: column !important;
              gap: 16px !important;
              padding: 12px !important;
            }
            .ig-banner-iframe {
              width: 100% !important;
              max-width: 100vw !important;
              height: 340px !important;
            }
          }
        `}</style>
      </div>
    );
  }

  // Default card format
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 480,
        margin: '0 auto',
        padding: '2rem 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
        borderRadius: 32,
        boxShadow: '0 8px 32px 0 rgba(60, 0, 120, 0.25)',
        position: 'relative',
      }}
    >
      <div
        style={{
          background: 'rgba(30, 27, 75, 0.95)',
          borderRadius: 24,
          boxShadow: '0 4px 24px 0 rgba(60, 0, 120, 0.15)',
          padding: 24,
          width: 400,
          maxWidth: '90vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ fontWeight: 700, color: '#a78bfa', fontSize: 22, marginBottom: 16, letterSpacing: 1 }}>
          Follow Us On Instagram
        </div>
        <iframe
          src="https://www.instagram.com/devtone_agency/embed/"
          width="340"
          height="440"
          frameBorder="0"
          scrolling="no"
          allowTransparency={true}
          style={{ border: 'none', overflow: 'hidden', borderRadius: 16, background: '#fff' }}
          title="Instagram Widget"
        ></iframe>
        <a
          href="https://www.instagram.com/devtone_agency/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginTop: 18,
            color: '#fff',
            background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
            padding: '10px 28px',
            borderRadius: 999,
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 2px 8px 0 rgba(124, 58, 237, 0.15)',
            transition: 'background 0.2s',
            display: 'inline-block',
          }}
        >
          View Profile
        </a>
      </div>
    </div>
  );
};

export default InstagramWidget;
