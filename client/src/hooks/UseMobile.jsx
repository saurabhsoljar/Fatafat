import React, { useEffect, useState } from 'react';

const UseMobile = (breakpoint = 786) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  const handleResize = () => {
    const isMobileCheck = window.innerWidth < breakpoint; // Check if the window width is less than the breakpoint
    setIsMobile(isMobileCheck); // Update the state
  };

  useEffect(() => {
    handleResize(); // Initial check on component mount

    window.addEventListener('resize', handleResize); // Add event listener for window resize

    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup event listener on component unmount
    };
  }, [breakpoint]); // Add breakpoint as a dependency to re-run the effect if it changes

  return [isMobile]; // Return the isMobile state
};

export default UseMobile;