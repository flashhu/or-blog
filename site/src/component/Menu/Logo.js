import React from 'react'

export const Logo = React.memo(({ active }) => (
    <div className={active ? "logo active" : "logo"}>
        <div className="logo_high"></div>
        <div className="logo_high"></div>
        <div className="logo_middle left_bottom"></div>
        <div className="logo_middle"></div>
        <div className="logo_low left_bottom"></div>
        <div className="logo_high right_bottom"></div>
        <div className="logo_middle"></div>
        <div className="logo_middle"></div>
        <div className="logo_middle top_right"></div>
        <div className="logo_high left_both"></div>
        <div className="logo_high right_both"></div>
    </div>
))

export const MiniLogo = React.memo(({ active }) => (
    <div className={active ? "logo mini active" : "logo mini"}>
        <div className="logo_high diagonal"></div>
        <div className="logo_high diagonal"></div>
    </div>
))